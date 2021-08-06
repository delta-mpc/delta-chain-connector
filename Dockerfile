FROM python:3.7-slim

WORKDIR /app

COPY whls /app/whls

RUN pip install --no-cache-dir whls/*.whl &&  rm -rf whls

CMD [ "coordinator_start" ]