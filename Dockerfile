FROM node:16

WORKDIR /dcc

COPY src /dcc/src
COPY package*.json /dcc/
COPY bin /dcc/bin
COPY tsconfig.json /dcc/

RUN npm install && npm run build:ts && npm install . -g

WORKDIR /app

ENTRYPOINT ["bash"]

