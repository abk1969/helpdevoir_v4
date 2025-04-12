#!/bin/bash

# Afficher un message de bienvenue
echo "=== Démarrage de l'application HelpDevoir avec Docker ==="
echo "Ce script va construire et démarrer les conteneurs Docker pour l'application."

# Vérifier si Docker est installé
if ! command -v docker &> /dev/null; then
    echo "Docker n'est pas installé. Veuillez installer Docker avant de continuer."
    exit 1
fi

# Vérifier si Docker Compose est installé
if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose n'est pas installé. Veuillez installer Docker Compose avant de continuer."
    exit 1
fi

# Arrêter les conteneurs existants s'ils existent
echo "Arrêt des conteneurs existants..."
docker-compose down

# Construire et démarrer les conteneurs
echo "Construction et démarrage des conteneurs..."
docker-compose up -d --build

# Vérifier si les conteneurs sont en cours d'exécution
if [ $? -eq 0 ]; then
    echo "=== Application démarrée avec succès ! ==="
    echo "Frontend: http://localhost"
    echo "API: http://localhost/api"
    echo ""
    echo "Pour arrêter l'application, exécutez: docker-compose down"
else
    echo "Une erreur s'est produite lors du démarrage de l'application."
    exit 1
fi
