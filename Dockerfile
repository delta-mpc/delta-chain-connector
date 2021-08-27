FROM python:3.7-buster as builder

WORKDIR /app

COPY coordinator /app/coordinator
COPY setup.py /app/setup.py

RUN pip wheel -w whls .

FROM python:3.7-slim-buster

WORKDIR /app

COPY --from=builder /app/whls /app/whls

RUN pip install --no-cache-dir whls/*.whl &&  rm -rf whls
ENTRYPOINT [ "coordinator_start" ]
CMD [ "run" ]