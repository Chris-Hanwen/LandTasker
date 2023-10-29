FROM node:16-alpine3.15

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY dist ./

# Connect to database
ARG DB
ENV db=$DB

CMD [ "node", "index.js" ]
