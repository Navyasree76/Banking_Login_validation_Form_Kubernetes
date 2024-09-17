FROM node:18 
WORKDIR /capsuled
COPY package*.json ./
RUN npm install 
COPY . .
EXPOSE 3002
CMD ["node", "server.js"]