"""
WSGI Entry Point for Production Deployment
Use with Gunicorn: gunicorn -w 4 -b 0.0.0.0:5000 wsgi:app
"""
import os
from app import create_app, db

app = create_app(os.getenv('FLASK_ENV', 'production'))


@app.shell_context_processor
def make_shell_context():
    """Make database object available in Flask shell"""
    return {'db': db}


if __name__ == '__main__':
    app.run()
