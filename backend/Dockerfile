# 1. Imagen base con Node.js
FROM node:18-alpine

# 2. Directorio de trabajo dentro del contenedor
WORKDIR /app

# 3. Copiamos package.json y package-lock.json (para cachear dependencias)
COPY package*.json ./

# 4. Instalamos dependencias
RUN npm install

# 5. Copiamos todo el código fuente
COPY . .

# 6. Construimos el proyecto TypeScript (genera la carpeta dist)
RUN npm run build

# 7. Exponemos el puerto que usa el backend (configurado en .env o 4000 por defecto)
EXPOSE 4000

# 8. Comando para ejecutar la app en producción (usando código compilado)
CMD ["node", "dist/index.js"]
