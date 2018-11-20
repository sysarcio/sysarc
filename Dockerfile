FROM node:8.11.1

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN npm install forever -g

COPY . .

EXPOSE 80

CMD ["npm", "--", "start"]


