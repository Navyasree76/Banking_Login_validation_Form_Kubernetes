FROM node:18 
WORKDIR /capsuled
COPY package*.json ./
RUN npm install 
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]