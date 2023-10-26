FROM node:19-alpine

RUN apk add ffmpeg

COPY ./scripts/entrypoint.sh /usr/bin/entrypoint.sh

RUN mkdir -p /usr/src/app && \
    chmod -R 777 /usr/src/app && \
    chmod +x /usr/bin/entrypoint.sh

COPY ./package*.json /usr/bin/app/

WORKDIR /usr/src/app

ENTRYPOINT ["entrypoint.sh"]