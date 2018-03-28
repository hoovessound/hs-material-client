FROM node

WORKDIR /app

COPY package.json .

RUN npm install

# RUN npm install yarn -g

# RUN yarn install --no-lockfile

COPY . .

RUN npm run build

# RUN yarn run build

# RUN yarn global add serve

RUN npm install serve -g

RUN serve -s build

EXPOSE 5000