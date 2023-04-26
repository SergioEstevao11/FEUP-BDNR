FROM node:20-alpine3.16

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

RUN npm run build


# Start the app
CMD ["npm", "run", "dev"]