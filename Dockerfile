FROM node

RUN curl -o- -L https://yarnpkg.com/install.sh | bash

WORKDIR /app

COPY package.json .

RUN yarn install && \
    yarn global add serve

COPY . .

RUN yarn build

CMD serve -tns build

EXPOSE 5000