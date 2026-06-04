@echo off
echo === Praise Church Music Platform Setup ===

echo Setting up Django backend...
cd backend
python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python manage.py makemigrations users posts communities reactions songbook saves
python manage.py migrate
python manage.py seed_data
call deactivate
cd ..

echo Setting up React frontend...
cd frontend
npm install
cd ..

echo.
echo Setup complete!
echo.
echo Backend:  cd backend ^&^& venv\Scripts\activate ^&^& python manage.py runserver
echo Frontend: cd frontend ^&^& npm run dev
echo.
echo Admin: admin@church.com / Admin@1234
echo User:  john@church.com  / User@1234
pause
