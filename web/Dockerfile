FROM node:20.12.2 AS node_builder

ENV VUE_APP_NODE_ENV=production

WORKDIR /web

COPY package.json package.json
COPY yarn.lock yarn.lock

RUN yarn install --no-cache -p
# --package-lock-only

COPY . .

RUN yarn run build-prod

FROM nginx

COPY --from=node_builder /web/dist/ /var/www/chessautochess5/

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD /bin/sh -c "nginx -g 'daemon off;'"
