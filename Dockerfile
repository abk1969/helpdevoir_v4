# Étape de build
FROM node:18-alpine AS build

WORKDIR /app

# Copier les fichiers de configuration
COPY package.json ./
COPY tsconfig.json ./
COPY tsconfig.app.json ./
COPY tsconfig.node.json ./
COPY vite.config.ts ./
COPY postcss.config.js ./
COPY tailwind.config.js ./
COPY eslint.config.js ./
COPY index.html ./
COPY .env ./

# Installer les dépendances
RUN npm install

# Copier le code source
COPY src/ ./src/

# Construire l'application
RUN npm run build

# Étape de production
FROM nginx:alpine AS production

# Copier la configuration nginx
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Copier les fichiers de build depuis l'étape précédente
COPY --from=build /app/dist /usr/share/nginx/html

# Exposer le port 80
EXPOSE 80

# Commande pour démarrer nginx
CMD ["nginx", "-g", "daemon off;"]
