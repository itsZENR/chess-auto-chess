FROM node:20.12.2 AS node_builder

WORKDIR /web

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN yarn install
# --package-lock-only

COPY . .

RUN yarn run build-prod



FROM nginx

COPY --from=node_builder /web/dist/ /var/www/chessautochess5/

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD /bin/sh -c "nginx -g 'daemon off;'"
