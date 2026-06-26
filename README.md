# Salone Water Watch - Water Security Platform

A comprehensive water security system designed for rural communities in Sierra Leone. Salone Water Watch leverages a dual-interface (Web + SMS) to ensure accessibility for all users, including those with basic feature phones.

## Project Overview

**Salone Water Watch** addresses the critical gap in clean water access caused by drought, infrastructure failure, and poor management by providing:

- Real-time water quality and availability status updates
- Root cause identification for water source failures
- Predictive warnings for droughts and contamination risks
- Proactive maintenance and repair dispatch system
- Community education via SMS and web platform

## Features (The 7 Pillars)

1. **Water Quality Status** - Visual indicators (Green/Yellow/Red) for water safety
2. **Root Cause Analysis** - Reporting system for 6 categories of water issues
3. **Prevention System** - Automated maintenance reminders and guides
4. **Warning Ahead** - SMS alerts for predicted droughts and contamination
5. **Tracking Dashboard** - Real-time web map and SMS query system
6. **Educational Hub** - Health tips and technical guides
7. **Solution Dispatch** - Repair case assignment and tracking

## Technology Stack

| Layer | Technology |
|:------|:-----------|
| **Backend** | Python 3.10+ / Flask |
| **Database** | SQLite via SQLAlchemy |
| **Frontend** | React / TypeScript / Tailwind CSS |
| **SMS Gateway** | Africa's Talking API |
| **Mapping** | Leaflet.js |
| **Containerization** | Docker / Docker Compose |

## Project Structure

```
salonewaterwatch/
├── backend/                # Flask API and Business Logic
├── frontend/               # React Web Application
├── docker-compose.yml      # Container orchestration
├── .gitignore              # Git exclusion rules
├── README.md               # This file
└── .env.example            # Template for environment variables
```

## Quick Start

### Prerequisites
- Python 3.10+
- Node.js 16+
- Git

### Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp ../.env.example .env
flask db upgrade
flask run
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Docker Setup (Recommended)
```bash
docker-compose up
```

The application will be available at `http://localhost:3000` (frontend) and `http://localhost:5000` (backend API).

## SMS Commands

Users can interact with the system via SMS:

- **STATUS [ID]** - Check water source status
- **CAUSE [ID] [CODE]** - Report an issue
- **NEARBY [AREA]** - Find nearest functional water sources
- **TIPS** - Receive health/maintenance tips

## Documentation

- [Setup Guide](./docs/SETUP_GUIDE.md) - Detailed installation instructions
- [API Documentation](./docs/API_DOCUMENTATION.md) - Complete endpoint reference
- [Design System](./docs/DESIGN_SYSTEM.md) - UI/UX principles and components
- [Architecture](./docs/ARCHITECTURE.md) - System design and data flow

## Configuration

Copy `.env.example` to `.env` and configure:

```env
FLASK_APP=wsgi.py
FLASK_ENV=development
DATABASE_URL=sqlite:///instance/salonewaterwatch.db
AT_USERNAME=your_africas_talking_username
AT_API_KEY=your_africas_talking_api_key
SECRET_KEY=your_secret_key_here
```

## Contributing

This project is open-source under the MIT License. Contributions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit changes (`git commit -am 'Add feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Create a Pull Request

## License

MIT License - See LICENSE file for details

## Support

For issues, questions, or suggestions, please open a GitHub issue or contact the team.

---

**Salone Water Watch**: Bringing clean water security to every community.

** ScreenShot **
<img width="1600" height="701" alt="image" src="https://github.com/user-attachments/assets/9a393008-4be9-4423-9255-7763b9f7717c" />
<img width="1600" height="588" alt="image" src="https://github.com/user-attachments/assets/2e7bfb88-8550-43c5-911a-2785d8b07e03" />
<img width="1600" height="710" alt="image" src="https://github.com/user-attachments/assets/10855636-8249-4743-92c6-edeb5a7215a7" />
<img width="1600" height="565" alt="image" src="https://github.com/user-attachments/assets/85e0756d-5d5e-401f-bf6c-424079476806" />
<img width="1600" height="729" alt="image" src="https://github.com/user-attachments/assets/1c20a1e6-8fa1-4d7f-b4a3-8daf6d2b386f" />
<img width="1600" height="729" alt="image" src="https://github.com/user-attachments/assets/4e67b27b-aa62-4dae-8466-934bdb4be0ee" />






