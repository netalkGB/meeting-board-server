FROM node:16-slim

ENV TZ='Asia/Tokyo'
ENV HOST=0.0.0.0

RUN apt update && apt install -y chromium fonts-noto-cjk

COPY ./src /server
COPY ./appconfig.json /server/appconfig.json
COPY ./service-account-key.json /server/service-account-key.json

WORKDIR /server

EXPOSE 3000 3000/tcp

RUN yarn
RUN yarn build

CMD ["yarn", "start"]
