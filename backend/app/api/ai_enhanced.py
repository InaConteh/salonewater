"""
Enhanced AI API Endpoints for CleanFlow SL
Includes streaming, context support, health checks, and error handling
"""
from flask import request, jsonify, Response, stream_with_context
from app.api import bp
from app.services.ai_service_enhanced import (
    ask_cleanflow_ai,
    check_ollama_health,
    OllamaError,
    format_error_message
)
import logging
import json
from functools import wraps
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

# Simple rate limiting (in production, use Redis)
from collections import defaultdict
from datetime import datetime, timedelta

request_counts = defaultdict(list)

def rate_limit(max_requests: int = 10, window_seconds: int = 60):
    """Rate limiting decorator"""
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            # Get user ID (or IP if not authenticated)
            user_id = None
            try:
                from flask_jwt_extended import get_jwt_identity
                user_id = get_jwt_identity()
            except:
                user_id = request.remote_addr
            
            now = datetime.now()
            # Clean old requests
            request_counts[user_id] = [
                ts for ts in request_counts[user_id]
                if now - ts < timedelta(seconds=window_seconds)
            ]
            
            # Check limit
            if len(request_counts[user_id]) >= max_requests:
                return jsonify({
                    'error': 'Rate limit exceeded. Please wait before making another request.'
                }), 429
            
            request_counts[user_id].append(now)
            return f(*args, **kwargs)
        return decorated
    return decorator

# ============================================================================
# ENDPOINTS
# ============================================================================

@bp.route('/ai/health', methods=['GET'])
def ai_health():
    """
    Health check for AI service and Ollama connection
    
    Returns:
        {
            "status": "healthy" | "unhealthy",
            "ollama": {
                "status": "healthy" | "unhealthy",
                "model": "qwen2.5:1.5b",
                "latency_ms": 245,
                "error": null
            },
            "api": "OK"
        }
    """
    health = check_ollama_health()
    
    return jsonify({
        'status': 'healthy' if health['status'] == 'healthy' else 'unhealthy',
        'ollama': health,
        'api': 'OK',
        'timestamp': datetime.now().isoformat()
    }), 200 if health['status'] == 'healthy' else 503


@bp.route('/ai/ask', methods=['POST'])
@rate_limit(max_requests=10, window_seconds=60)
def ask_ai():
    """
    Ask the CleanFlow AI a question
    
    Request body:
    {
        "query": "How do I know if water is safe?",
        "category": "health" | "maintenance" | "general" (default: "general"),
        "language": "en" | "krio" (default: "en"),
        "context": {
            "well_id": "W001",
            "well_name": "Main Well",
            "district": "Bo",
            "status": "Broken pump",
            "water_quality": "Contaminated",
            "last_report": "2024-06-02"
        }
    }
    
    Response:
    {
        "answer": "...",
        "query": "...",
        "category": "health",
        "language": "en",
        "context_used": true,
        "cached": false
    }
    """
    try:
        data = request.json or {}
        
        # Validate required fields
        query = data.get('query', '').strip()
        if not query:
            return jsonify({'error': 'Query is required'}), 400
        
        # Get parameters
        category = data.get('category', 'general').lower()
        language = data.get('language', 'en').lower()
        context = data.get('context')
        
        # Call AI service
        answer = ask_cleanflow_ai(
            user_query=query,
            context_type=category,
            context=context,
            language=language,
            stream=False
        )
        
        logger.info(f"AI query successful: category={category}, lang={language}")
        
        return jsonify({
            'answer': answer,
            'query': query,
            'category': category,
            'language': language,
            'context_used': context is not None,
            'cached': False
        }), 200
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except OllamaError as e:
        logger.warning(f"Ollama error: {str(e)}")
        user_msg = format_error_message(e, user_facing=True)
        return jsonify({
            'error': user_msg,
            'code': 'OLLAMA_UNAVAILABLE'
        }), 503
    except Exception as e:
        logger.error(f"Unexpected error in /ai/ask: {str(e)}")
        return jsonify({
            'error': 'An unexpected error occurred. Please try again.',
            'code': 'INTERNAL_ERROR'
        }), 500


@bp.route('/ai/stream', methods=['POST'])
@rate_limit(max_requests=10, window_seconds=60)
def stream_ai():
    """
    Stream AI responses in real-time using Server-Sent Events (SSE)
    
    Same request body as /ai/ask
    
    Response: Server-Sent Events stream with text chunks
    """
    try:
        data = request.json or {}
        
        # Validate required fields
        query = data.get('query', '').strip()
        if not query:
            return jsonify({'error': 'Query is required'}), 400
        
        # Get parameters
        category = data.get('category', 'general').lower()
        language = data.get('language', 'en').lower()
        context = data.get('context')
        
        def generate():
            """Generator function for streaming responses"""
            try:
                # Send start event
                yield f'data: {json.dumps({"status": "started"})}\n\n'
                
                # Get streaming response
                response_gen = ask_cleanflow_ai(
                    user_query=query,
                    context_type=category,
                    context=context,
                    language=language,
                    stream=True
                )
                
                # Stream each chunk
                for chunk in response_gen:
                    if chunk:
                        yield f'data: {json.dumps({"text": chunk})}\n\n'
                
                # Send completion event
                yield f'data: {json.dumps({"status": "completed"})}\n\n'
                
                logger.info(f"AI stream successful: category={category}, lang={language}")
                
            except OllamaError as e:
                logger.warning(f"Streaming error: {str(e)}")
                user_msg = format_error_message(e, user_facing=True)
                yield f'data: {json.dumps({"error": user_msg, "status": "failed"})}\n\n'
            except Exception as e:
                logger.error(f"Stream error: {str(e)}")
                yield f'data: {json.dumps({"error": "Stream interrupted. Please try again.", "status": "failed"})}\n\n'
        
        return Response(
            stream_with_context(generate()),
            mimetype='text/event-stream',
            headers={
                'Cache-Control': 'no-cache',
                'X-Accel-Buffering': 'no'
            }
        ), 200
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        logger.error(f"Unexpected error in /ai/stream: {str(e)}")
        return jsonify({
            'error': 'An unexpected error occurred.',
            'code': 'INTERNAL_ERROR'
        }), 500


@bp.route('/ai/context/well/<well_id>', methods=['GET'])
def get_well_context_endpoint(well_id: str):
    """
    Get contextual information about a specific well for AI queries
    
    Args:
        well_id: The ID of the water source/well
        
    Returns:
    {
        "context": {
            "well_id": "W001",
            "well_name": "Main Well",
            "district": "Bo",
            "status": "Operational",
            "water_quality": "Safe",
            "last_report": "2024-06-02",
            "source_type": "Borehole"
        },
        "recent_reports": [...],
        "suggested_queries": ["Why is water pressure low?", "How to maintain this well?"]
    }
    """
    try:
        from app.models import WaterSource, Report
        
        # Get well from database
        well = WaterSource.query.filter_by(id=well_id).first()
        if not well:
            return jsonify({'error': 'Well not found'}), 404
        
        # Get recent reports
        recent_reports = (
            Report.query.filter_by(source_id=well_id)
            .order_by(Report.timestamp.desc())
            .limit(5)
            .all()
        )
        
        # Build context
        context = {
            'well_id': well.id,
            'well_name': well.name,
            'district': well.district,
            'status': well.status,
            'water_quality': 'unsafe' if (well.status or '').lower() == 'red' else 'safe',
            'last_report': well.last_updated.isoformat() if well.last_updated else None,
        }
        
        # Suggested AI queries based on status
        suggested_queries = []
        if (well.status or '').lower() in ['red', 'broken']:
            suggested_queries.append("How do I repair this well?")
        if (well.status or '').lower() == 'red':
            suggested_queries.append("Is this water safe to drink?")
        suggested_queries.extend([
            "How to maintain this well?",
            "What are the health risks?"
        ])
        
        return jsonify({
            'context': context,
            'recent_reports': [
                {
                    'id': r.id,
                    'cause': r.cause_category,
                    'date': r.timestamp.isoformat() if r.timestamp else None,
                    'notes': r.notes
                }
                for r in recent_reports
            ],
            'suggested_queries': suggested_queries
        }), 200
        
    except Exception as e:
        logger.error(f"Error fetching well context: {str(e)}")
        return jsonify({
            'error': 'Could not fetch well context'
        }), 500


@bp.route('/ai/suggest-questions/<context>', methods=['GET'])
def suggest_questions(context: str):
    """
    Get suggested questions for a given context
    
    Args:
        context: 'health', 'maintenance', 'water_quality', 'general'
        
    Returns:
    {
        "questions": ["Question 1", "Question 2", ...]
    }
    """
    suggestions = {
        'health': [
            'Is this water safe to drink?',
            'What are the signs of waterborne disease?',
            'How do I boil water safely?',
            'What is cholera and how do I prevent it?',
            'How can I store water safely?'
        ],
        'maintenance': [
            'How do I fix a weak hand pump?',
            'What causes a pump to have no pressure?',
            'How do I repair a leaking well?',
            'What preventive maintenance should I do?',
            'How do I clean a contaminated well?'
        ],
        'water_quality': [
            'What do yellow/red status colors mean?',
            'How is water quality tested?',
            'What causes water contamination?',
            'How often should we test water?',
            'What is safe chlorine level?'
        ],
        'general': [
            'What is CleanFlow?',
            'How do I report a problem?',
            'Where can I find clean water nearby?',
            'How do I contact support?',
            'What should I do if my well is broken?'
        ]
    }
    
    context = context.lower()
    questions = suggestions.get(context, suggestions['general'])
    
    return jsonify({
        'context': context,
        'questions': questions
    }), 200


@bp.route('/ai/translate', methods=['POST'])
def translate_text():
    """
    Translate text between English and Krio
    
    Request body:
    {
        "text": "How do I know if water is safe?",
        "target_language": "krio"
    }
    
    Response:
    {
        "original": "How do I know if water is safe?",
        "translated": "...",
        "target_language": "krio"
    }
    """
    try:
        data = request.json or {}
        text = data.get('text', '').strip()
        target = data.get('target_language', 'krio').lower()
        
        if not text:
            return jsonify({'error': 'Text is required'}), 400
        
        if target not in ['en', 'krio']:
            return jsonify({'error': 'Target language must be en or krio'}), 400
        
        # Use AI to translate
        system_prompt = "You are a professional translator between English and Sierra Leonean Krio. Translate the text accurately and naturally. Do not add any explanations or preamble. Just provide the translation."
        
        query = f"Translate the following text to {target}:\n\n{text}"
        
        translated = ask_cleanflow_ai(
            user_query=query,
            context_type='general',
            language='en',
            stream=False,
            system_prompt_override=system_prompt
        )
        
        return jsonify({
            'original': text,
            'translated': translated.strip(),
            'target_language': target
        }), 200
        
    except Exception as e:
        logger.error(f"Translation error: {str(e)}")
        return jsonify({'error': 'Translation failed'}), 500


# ============================================================================
# ERROR HANDLERS
# ============================================================================

@bp.errorhandler(429)
def ratelimit_handler(e):
    """Handle rate limit errors"""
    return jsonify({
        'error': 'Too many requests. Please wait before trying again.',
        'code': 'RATE_LIMIT_EXCEEDED'
    }), 429


@bp.errorhandler(500)
def internal_error(e):
    """Handle internal server errors"""
    logger.error(f"Internal server error: {str(e)}")
    return jsonify({
        'error': 'An internal server error occurred.',
        'code': 'INTERNAL_ERROR'
    }), 500
