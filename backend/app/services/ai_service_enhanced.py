"""
Enhanced AI Service for CleanFlow SL
Includes streaming support, context injection, multi-language support, and error handling
"""
import requests
import json
import logging
from typing import Optional, Dict, Any, Generator
from datetime import datetime
import time

logger = logging.getLogger(__name__)

OLLAMA_URL = "http://localhost:11434/api/generate"
OLLAMA_HEALTH_URL = "http://localhost:11434/api/tags"
OLLAMA_TIMEOUT = 30

# System prompts optimized for Sierra Leone context
SYSTEM_PROMPTS = {
    "health_en": """You are a health expert for CleanFlow SL, a water security platform in Sierra Leone.
Your role is to provide practical, life-saving health advice about:
- Waterborne diseases (cholera, typhoid, dysentery, diarrhea)
- Water safety (boiling, chlorine treatment, storage)
- Sanitation and hygiene practices
- Safe drinking water identification

Important Rules:
1. Keep responses SHORT and simple (2-3 sentences maximum)
2. Use Grade 6 level English (simple words, short sentences)
3. ALWAYS start with the key action to take
4. NEVER provide medical diagnosis (refer to health worker)
5. End with: "Contact a health worker if symptoms persist"
6. Be specific about quantities (e.g., "boil for 1 minute", "1 cup per 20 liters")
7. Focus on what rural communities can actually do""",

    "health_krio": """You be di bes heltn ekspet for CleanFlow SL water platform for Salone.
Your wok na fo giv praktical, life-sevin heltn advaes bout:
- Wata sik (cholera, typhoid, belly sick)
- How fo drink safe wata (boil um, put salt, kin um in clay pot)
- Clean bodi and bodi place
- How fo know if wata gud

Impotant tin:
1. Keep answer sho-sho (jus 2-3 sentensh)
2. Use simple Krio (no big big word)
3. Start wit di main ting fo do
4. Na don giv sik helop (tel pikin go see dakta)
5. End wit: "Go see help waka if bodi na pain"
6. Giv klear klear ting (example: "boil 1 minut", "1 kap for 20 poto")
7. Talk bout tin di peple dem for kontri kin du""",

    "maintenance_en": """You are a technical engineer helping rural communities maintain water wells and pumps in Sierra Leone.
Provide simple, step-by-step repair guidance for:
- Hand pumps (broken seals, rod issues, weak pressure, rust)
- Wells (contamination, low water levels, structural damage)
- Storage tanks (leaks, cracks, algae growth)
- Boreholes (blockages, low yield)

Important Rules:
1. Assume NO professional tools are available (use local materials)
2. Give realistic time estimates
3. Include clear safety warnings
4. Use local language context (e.g., rubber from bicycle tires)
5. Suggest preventive maintenance (check monthly)
6. If repair is too complex, recommend calling a technician""",

    "maintenance_krio": """You be di bes teknikal man for help kontri peple dem for Salone fix wata hol and pump.
Giv simple, step-by-step way fo fix:
- Hand pump (rubber break, stick problem, wata weak, iron rust)
- Wata hol (wata dirty, wata don finish, hol break)
- Wata pot (wata dripm dripm, crack, green ting grow)
- Deep hol (stick up, wata don go)

Impotant tin:
1. Na don use big big tool - use lokol tin dem (baisekul rubber, tin dem)
2. Giv tru-tru tiem fo di wok (no joke tiem)
3. Tok about danger danger tin
4. Use Salone way fo talk tin
5. Toch pikin fo check um evri mont
6. If wak too hord, tel dem go kol teknishan man""",

    "general": """You are a helpful assistant for the CleanFlow SL water security platform in Sierra Leone.
Your role is to provide information about:
- Water sources and their status
- Water safety and testing
- Maintenance and repair guidance
- Community water management
- Health and sanitation

Be concise, friendly, and helpful. Always prioritize accuracy and safety."""
}

class OllamaError(Exception):
    """Custom exception for Ollama-related errors"""
    pass

def check_ollama_health() -> Dict[str, Any]:
    """
    Check if Ollama is running and accessible
    Returns: {status: 'healthy'|'unhealthy', model: str, latency_ms: int, error: str}
    """
    try:
        start = time.time()
        response = requests.get(OLLAMA_HEALTH_URL, timeout=5)
        latency = (time.time() - start) * 1000
        
        if response.status_code == 200:
            data = response.json()
            models = data.get('models', [])
            if models:
                return {
                    'status': 'healthy',
                    'model': models[0].get('name', 'unknown'),
                    'latency_ms': int(latency),
                    'error': None
                }
            else:
                return {
                    'status': 'unhealthy',
                    'model': None,
                    'latency_ms': int(latency),
                    'error': 'No models loaded in Ollama'
                }
        else:
            return {
                'status': 'unhealthy',
                'model': None,
                'latency_ms': int(latency),
                'error': f'HTTP {response.status_code}'
            }
    except requests.exceptions.Timeout:
        return {
            'status': 'unhealthy',
            'model': None,
            'latency_ms': 5000,
            'error': 'Connection timeout'
        }
    except requests.exceptions.ConnectionError:
        return {
            'status': 'unhealthy',
            'model': None,
            'latency_ms': 0,
            'error': 'Connection refused - Ollama not running'
        }
    except Exception as e:
        return {
            'status': 'unhealthy',
            'model': None,
            'latency_ms': 0,
            'error': str(e)
        }

def ask_cleanflow_ai(
    user_query: str,
    context_type: str = "general",
    context: Optional[Dict[str, Any]] = None,
    language: str = "en",
    stream: bool = False
) -> str | Generator[str, None, None]:
    """
    Ask CleanFlow AI a question with optional context
    
    Args:
        user_query: The user's question
        context_type: 'health', 'maintenance', or 'general'
        context: Optional context dict (well_id, district, source_info, etc.)
        language: 'en' or 'krio'
        stream: If True, returns a generator; if False, returns complete response
        
    Returns:
        String response or generator of text chunks
        
    Raises:
        OllamaError: If Ollama is not available or returns an error
    """
    
    # Validate inputs
    if not user_query or not user_query.strip():
        raise ValueError("Query cannot be empty")
    
    if len(user_query) > 2000:
        raise ValueError("Query too long (max 2000 characters)")
    
    context_type = context_type.lower()
    if context_type not in SYSTEM_PROMPTS:
        context_type = "general"
    
    language = language.lower()
    if language not in ['en', 'krio']:
        language = 'en'
    
    # Select appropriate system prompt
    prompt_key = f"{context_type}_{language}"
    if prompt_key not in SYSTEM_PROMPTS:
        prompt_key = f"{context_type}_en"  # Fallback to English
    
    system_prompt = SYSTEM_PROMPTS.get(prompt_key, SYSTEM_PROMPTS['general'])
    
    # Build context string if provided
    context_str = ""
    if context:
        context_str = "\n\nContext Information:"
        if context.get('well_id'):
            context_str += f"\n- Well ID: {context['well_id']}"
        if context.get('well_name'):
            context_str += f"\n- Well Name: {context['well_name']}"
        if context.get('district'):
            context_str += f"\n- District: {context['district']}"
        if context.get('status'):
            context_str += f"\n- Current Status: {context['status']}"
        if context.get('last_report'):
            context_str += f"\n- Last Report: {context['last_report']}"
        if context.get('water_quality'):
            context_str += f"\n- Water Quality: {context['water_quality']}"
    
    # Build the full prompt
    full_prompt = f"""{system_prompt}

User Question: {user_query}{context_str}

Answer:"""
    
    # Prepare payload
    payload = {
        "model": "qwen3:4b",
        "prompt": full_prompt,
        "stream": stream
    }
    
    try:
        if stream:
            return _stream_ollama_response(payload)
        else:
            return _get_ollama_response(payload)
    except Exception as e:
        logger.error(f"AI Service Error: {str(e)}")
        raise OllamaError(f"Failed to get AI response: {str(e)}")

def _get_ollama_response(payload: Dict) -> str:
    """Get complete response from Ollama (non-streaming)"""
    response = requests.post(
        OLLAMA_URL,
        json=payload,
        timeout=OLLAMA_TIMEOUT
    )
    response.raise_for_status()
    
    data = response.json()
    answer = data.get("response", "I'm sorry, I couldn't generate a response.")
    
    # Clean up response
    answer = answer.strip()
    
    # Log successful query
    logger.info(f"AI query processed: {payload['model']}")
    
    return answer

def _stream_ollama_response(payload: Dict) -> Generator[str, None, None]:
    """Stream responses from Ollama (real-time)"""
    try:
        response = requests.post(
            OLLAMA_URL,
            json=payload,
            timeout=OLLAMA_TIMEOUT,
            stream=True
        )
        response.raise_for_status()
        
        for line in response.iter_lines():
            if line:
                try:
                    data = json.loads(line)
                    text = data.get("response", "")
                    if text:
                        yield text
                except json.JSONDecodeError:
                    continue
                    
    except Exception as e:
        logger.error(f"Streaming error: {str(e)}")
        raise OllamaError(f"Streaming failed: {str(e)}")

def get_well_context(well_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Prepare context information from well data for AI queries
    
    Args:
        well_data: Dictionary with well information (from to_dict())
        
    Returns:
        Formatted context dictionary
    """
    return {
        'well_id': well_data.get('id'),
        'well_name': well_data.get('name'),
        'district': well_data.get('district'),
        'status': well_data.get('status'),
        'water_quality': 'unsafe' if (well_data.get('status') or '').lower() == 'red' else 'safe',
        'last_report': well_data.get('last_updated'),
    }

def format_error_message(error: Exception, user_facing: bool = True) -> str:
    """
    Format error messages for user or logging
    
    Args:
        error: The exception
        user_facing: If True, return user-friendly message; if False, return technical details
        
    Returns:
        Formatted error message
    """
    if user_facing:
        if isinstance(error, OllamaError):
            if "Connection refused" in str(error):
                return "The AI assistant is temporarily offline. Please try again in a moment."
            elif "timeout" in str(error).lower():
                return "The AI assistant is slow to respond. Try rephrasing your question or check your internet connection."
            else:
                return "We couldn't generate a response. Please try again or rephrase your question."
        else:
            return "An error occurred while processing your request. Please try again."
    else:
        return str(error)
