FROM node:16-alpine as builder

WORKDIR /app

COPY package*.json /app/
COPY src /app/src
COPY tsconfig.json /app/

RUN npm ci && npm run build:ts

FROM node:16-alpine

WORKDIR /app

COPY --from=builder /app/dist /app/dist
COPY package*.json /app/
RUN npm ci --production
COPY run.sh /app/

ENTRYPOINT [ "/bin/sh", "run.sh" ]
CMD [ "run" ]
