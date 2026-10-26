@echo off
rem Double-click to preview the portfolio locally at http://localhost:8000
cd /d "%~dp0"
start "" http://localhost:8000
python serve.py 8000
