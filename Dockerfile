FROM node:16

WORKDIR /app

# Zainstaluj zależności przed skopiowaniem reszty plików
COPY package*.json ./
RUN npm install

# Kopiuj pliki prisma
COPY prisma ./prisma/
RUN npx prisma generate

# Teraz możesz skopiować resztę plików
COPY . .

RUN npm run build

EXPOSE 3334
CMD [ "node", "dist/main" ]
