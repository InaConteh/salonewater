# Database Initialization Guide for CleanFlow SL

CleanFlow SL is configured to use SQLite for local development. The local database file is:

```text
backend/instance/cleanflow.db
```

## Setup

From the backend directory:

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python -m flask db upgrade
python seed_initial_data.py
```

On macOS/Linux, activate the virtual environment with:

```bash
source venv/bin/activate
```

## Environment

Use this database URL for local SQLite:

```env
DATABASE_URL=sqlite:///instance/cleanflow.db
```

The backend config normalizes this relative SQLite path to an absolute path under `backend/instance`.

## Verify

```bash
python -c "from app import create_app; app=create_app('development'); print(app.config['SQLALCHEMY_DATABASE_URI'])"
```

You should see a SQLite URI pointing to `backend/instance/cleanflow.db`.
