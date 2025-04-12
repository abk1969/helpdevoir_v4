# HelpDevoir

Application d'aide aux devoirs pour les élèves avec des besoins spécifiques.

## Fonctionnalités

- Gestion des élèves et de leurs matières
- Adaptation des contenus pour les élèves dyslexiques, malentendants et malvoyants
- Correction automatique des devoirs avec IA
- Interface utilisateur intuitive et accessible

## Prérequis

- Docker et Docker Compose
- Git

## Installation et démarrage

### Avec Docker (recommandé)

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/abk1969/helpdevoir_v4.git
   cd helpdevoir_v4
   ```

2. Créez un fichier `.env` à partir du modèle :
   ```bash
   cp .env.example .env
   ```

3. Modifiez le fichier `.env` avec vos clés API et configurations.

4. Lancez l'application avec Docker :
   ```bash
   # Sur Windows
   .\start-docker.bat

   # Sur Linux/macOS
   chmod +x start-docker.sh
   ./start-docker.sh
   ```

5. Accédez à l'application dans votre navigateur :
   - Frontend : http://localhost
   - API : http://localhost/api

### Sans Docker (développement)

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/abk1969/helpdevoir_v4.git
   cd helpdevoir_v4
   ```

2. Installez les dépendances frontend :
   ```bash
   npm install
   ```

3. Installez les dépendances backend :
   ```bash
   pip install -r requirements.txt
   ```

4. Créez un fichier `.env` à partir du modèle :
   ```bash
   cp .env.example .env
   ```

5. Modifiez le fichier `.env` avec vos clés API et configurations.

6. Lancez le frontend :
   ```bash
   npm run dev
   ```

7. Lancez l'API dans un autre terminal :
   ```bash
   npm run start-api
   ```

8. Accédez à l'application dans votre navigateur :
   - Frontend : http://localhost:5173
   - API : http://localhost:5000/api

## Structure du projet

- `src/` : Code source de l'application
  - `api/` : API backend en Python/Flask
  - `components/` : Composants React réutilisables
  - `hooks/` : Hooks React personnalisés
  - `pages/` : Pages de l'application
  - `store/` : Gestion de l'état avec Zustand
  - `types/` : Types TypeScript
  - `utils/` : Utilitaires et fonctions d'aide
  - `config/` : Configuration de l'application
  - `services/` : Services pour les appels API

## Contribution

1. Créez une branche pour votre fonctionnalité (`git checkout -b feature/ma-fonctionnalite`)
2. Committez vos changements (`git commit -m 'Ajout de ma fonctionnalité'`)
3. Poussez vers la branche (`git push origin feature/ma-fonctionnalite`)
4. Ouvrez une Pull Request

## Licence

Ce projet est sous licence MIT.