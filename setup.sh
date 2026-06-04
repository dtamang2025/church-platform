#!/bin/bash
set -e

echo "=== Praise — Church Music Platform Setup ==="
echo ""

# Backend
echo ">>> Setting up Django backend..."
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
echo ">>> .env created — edit DB credentials if needed"
python manage.py makemigrations users posts communities reactions songbook saves
python manage.py migrate
python manage.py seed_data
echo ">>> Backend ready!"
deactivate
cd ..

# Frontend
echo ""
echo ">>> Setting up React frontend..."
cd frontend
npm install
echo ">>> Frontend ready!"
cd ..

echo ""
echo "=== Setup complete! ==="
echo ""
echo "To start:"
echo "  Backend:  cd backend && source venv/bin/activate && python manage.py runserver"
echo "  Frontend: cd frontend && npm run dev"
echo ""
echo "Demo accounts:"
echo "  Admin: admin@church.com / Admin@1234"
echo "  User:  john@church.com  / User@1234"
