@echo off
echo === Démarrage de l'application HelpDevoir avec Docker ===
echo Ce script va construire et démarrer les conteneurs Docker pour l'application.

REM Vérifier si Docker est installé
where docker >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Docker n'est pas installé. Veuillez installer Docker avant de continuer.
    exit /b 1
)

REM Vérifier si Docker Compose est installé
where docker-compose >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Docker Compose n'est pas installé. Veuillez installer Docker Compose avant de continuer.
    exit /b 1
)

REM Arrêter les conteneurs existants s'ils existent
echo Arrêt des conteneurs existants...
docker-compose down

REM Construire et démarrer les conteneurs
echo Construction et démarrage des conteneurs...
docker-compose up -d --build

REM Vérifier si les conteneurs sont en cours d'exécution
if %ERRORLEVEL% equ 0 (
    echo === Application démarrée avec succès ! ===
    echo Frontend: http://localhost
    echo API: http://localhost/api
    echo.
    echo Pour arrêter l'application, exécutez: docker-compose down
) else (
    echo Une erreur s'est produite lors du démarrage de l'application.
    exit /b 1
)
