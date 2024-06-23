FROM node:20.12.2 AS node_builder

WORKDIR /web

COPY package.json package.json
COPY yarn.lock yarn.lock

RUN yarn install --no-cache -p
# --package-lock-only

COPY . .

RUN yarn run build

FROM nginx

COPY scripts/generate_nginx_conf.sh /generate_nginx_conf.sh
RUN chmod +x /generate_nginx_conf.sh

COPY --from=node_builder /web/dist/ /var/www/chessautochess5/

COPY nginx.conf /etc/nginx/conf.d/default.conf.tpl

EXPOSE 80

CMD /bin/sh -c ". /generate_nginx_conf.sh && nginx -g 'daemon off;'"
