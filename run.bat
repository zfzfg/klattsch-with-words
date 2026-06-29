@echo off
echo Starte lokalen Server fuer Klattsch...
echo.
echo Oeffne deinen Browser und gehe zu: http://localhost:8088/
echo (Druecke STRG+C, um den Server zu beenden)
echo.
python -m http.server 8088
pause
