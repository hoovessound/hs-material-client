FROM node

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

RUN npm install serve -g

CMD serve -tns build

EXPOSE 5000