FROM node:16-slim

WORKDIR /dcc

COPY src /dcc/src
COPY package*.json /dcc/
COPY bin /dcc/bin
COPY tsconfig.json /dcc/
COPY tsconfig-build.json /dcc/

RUN npm install && npm run build:ts && npm install . -g

WORKDIR /app

ENTRYPOINT ["delta-chain-connector"]

CMD [ "run" ]
