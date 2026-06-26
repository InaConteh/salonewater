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
<img width="960" height="540" alt="image" src="https://github.com/user-attachments/assets/67371694-a43a-418f-bb8d-7cc2a7af8f49" />
<img width="960" height="540" alt="image" src="https://github.com/user-attachments/assets/f7689e69-214c-4691-8cc0-59a9a5123c21" />
<img width="960" height="540" alt="image" src="https://github.com/user-attachments/assets/98facc40-5654-4509-891c-f6f9ecbeb994" />
<img width="960" height="540" alt="image" src="https://github.com/user-attachments/assets/558abd71-e6c7-4c3f-9ddd-797ac15ad82c" />
<img width="960" height="540" alt="image" src="https://github.com/user-attachments/assets/60376572-5ad7-4084-a864-49adb8c1720a" />
<img width="960" height="540" alt="image" src="https://github.com/user-attachments/assets/b21e7a82-95a0-4f74-93c7-fbb851150cbe" />










