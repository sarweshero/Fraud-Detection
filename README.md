# Fraud Detection Dashboard

This project is a full-stack web application for credit card fraud detection with face authentication lock.

## Features
- User management and transaction analysis dashboard (React + Vite + Tailwind CSS)
- Backend API with FastAPI (Python)
- Face authentication (using webcam, validated by backend with `face_recognition`)
- SQLite database (default)

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm 9+

### Backend Setup
1. Navigate to the `Backend` folder:
   ```sh
   cd Backend
   ```
2. (Recommended) Create a virtual environment:
   ```sh
   python -m venv .venv
   .venv\Scripts\activate  # On Windows
   source .venv/bin/activate  # On Mac/Linux
   ```
3. Install Python dependencies:
   ```sh
   pip install -r requirements.txt
   ```
4. Make sure `me1_croped.jpg` (your reference face image) is in the `Backend` folder.
5. Start the FastAPI server:
   ```sh
   uvicorn main:app --reload
   ```

### Frontend Setup
1. Navigate to the `Frontend` folder:
   ```sh
   cd ../Frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the frontend dev server:
   ```sh
   npm run dev
   ```
4. Open the app in your browser (usually at http://localhost:5173)

## Usage
- On first load, the app will prompt for face authentication using your webcam.
- Only the person matching `me1_croped.jpg` can access the dashboard.
- Manage users and analyze transactions from the dashboard UI.

## Requirements
- See `Backend/requirements.txt` for Python dependencies.
- See `Frontend/package.json` for frontend dependencies.

## Notes
- For production, use HTTPS for camera access and secure deployment.
- The backend face authentication endpoint is `/face-auth` (expects a POST with an image file).

---

Made with ❤️ for your friend!
