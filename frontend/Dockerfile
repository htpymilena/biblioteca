FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

# Executa o Vite ouvindo em todas as interfaces para permitir o mapeamento de portas do Docker
CMD ["npm", "run", "dev", "--", "--host"]
