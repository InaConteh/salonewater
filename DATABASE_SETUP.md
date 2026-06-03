# Database Initialization Guide for CleanFlow SL

This guide provides step-by-step instructions for setting up the PostgreSQL database for CleanFlow SL.

## Prerequisites

- PostgreSQL 12+ (get from https://www.postgresql.org/download/)
- PostgreSQL installed and running on your system

## Option 1: Automated Setup (Recommended)

### Step 1: Ensure PostgreSQL is Running

**On Windows:**
```bash
# Check if PostgreSQL service is running
Get-Service postgresql-x64-* | Start-Service
```

**On macOS:**
```bash
brew services start postgresql
```

**On Linux:**
```bash
sudo systemctl start postgresql
```

### Step 2: Run Initialization Script

```bash
cd backend
psql -U postgres -f init_db.sql
```

This will:
- Create the `cleanflow_db` database
- Create the `cleanflow_user` account with password `secure_password`
- Grant all necessary permissions

### Step 3: Create `.env` File

```bash
cp ../.env.example ../.env
```

Update the `.env` file with your PostgreSQL credentials if different from defaults:

```env
DATABASE_URL=postgresql://cleanflow_user:secure_password@localhost:5432/cleanflow_db
```

### Step 4: Initialize Flask-Migrate

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```

---

## Option 2: Manual Setup (If Script Doesn't Work)

### Step 1: Open PostgreSQL CLI

```bash
psql -U postgres
```

You'll be prompted for the PostgreSQL password (usually the one you set during installation).

### Step 2: Execute SQL Commands

Run each command in the PostgreSQL CLI:

```sql
-- Create database
CREATE DATABASE cleanflow_db;

-- Create user
CREATE USER cleanflow_user WITH PASSWORD 'secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE cleanflow_db TO cleanflow_user;

-- Connect to database
\c cleanflow_db

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO cleanflow_user;

-- Exit
\q
```

### Step 3: Verify Connection

```bash
psql -U cleanflow_user -d cleanflow_db -h localhost
```

This should connect without asking for a password if the user was created correctly.

---

## Option 3: Docker Setup (Easiest)

If you have Docker installed, the `docker-compose.yml` will automatically create the database:

```bash
cd ../..
docker-compose up -d db
```

This will:
- Create a PostgreSQL container
- Initialize the database with the environment variables from `.env`
- Make the database available at `localhost:5432`

---

## Verifying Setup

### Check Database

```bash
psql -U cleanflow_user -d cleanflow_db -c "SELECT version();"
```

### Check Tables (After Flask Migration)

```bash
psql -U cleanflow_user -d cleanflow_db -c "\dt"
```

You should see empty results initially (tables will be created by Flask migrations).

---

## Troubleshooting

### Error: "role 'cleanflow_user' does not exist"

The user wasn't created. Run the SQL initialization script again or manually create the user.

### Error: "database 'cleanflow_db' does not exist"

The database wasn't created. Check the init_db.sql script executed without errors.

### Error: "connection refused"

PostgreSQL is not running. Start the PostgreSQL service (see Prerequisites section).

### Error: "Ident authentication failed"

Your PostgreSQL configuration is using `ident` authentication. Try:

```bash
psql -U postgres -h localhost -d cleanflow_db
```

---

## Next Steps

Once the database is initialized:

1. Activate backend virtual environment
2. Install Python dependencies: `pip install -r requirements.txt`
3. Run migrations: `flask db upgrade`
4. Start Flask development server: `flask run`

The database is now ready for Phase 2 (Backend Architecture & Models)!
