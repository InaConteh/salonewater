"""
Flask Application Factory and Database Initialization
"""
from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import config
import logging
from logging.handlers import RotatingFileHandler
import os

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()


def create_app(config_name=None):
    """
    Create and configure the Flask application.

    Args:
        config_name: Configuration environment (development, testing, production)

    Returns:
        Flask application instance
    """
    if config_name is None:
        config_name = os.getenv('FLASK_ENV', 'development')

    app = Flask(__name__)

    # Load configuration
    app.config.from_object(config[config_name])

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    CORS(app, resources={r'/api/*': {'origins': '*'}})

    # Import models to ensure they're registered with SQLAlchemy
    with app.app_context():
        from app.models import water_source, report, maintenance_log, repair_case

    # Register Blueprints
    from app.api import bp as api_bp
    app.register_blueprint(api_bp, url_prefix='/api')

    # Setup logging
    if not app.debug and not app.testing:
        if not os.path.exists('logs'):
            os.mkdir('logs')

        file_handler = RotatingFileHandler(
            'logs/salonewaterwatch.log',
            maxBytes=102402400,
            backupCount=10
        )
        file_handler.setFormatter(logging.Formatter(
            '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
        ))
        file_handler.setLevel(logging.INFO)
        app.logger.addHandler(file_handler)
        app.logger.setLevel(logging.INFO)
        app.logger.info('Salone Water Watch startup')

    @app.route('/', methods=['GET'])
    def index():
        return jsonify({
            'service': 'Salone Water Watch API',
            'health': '/health',
            'api_root': '/api',
            'message': 'Use /api to explore available endpoints.',
        }), 200

    @app.route('/health', methods=['GET'])
    def health():
        return {'status': 'ok', 'service': 'salonewaterwatch-api'}, 200

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
