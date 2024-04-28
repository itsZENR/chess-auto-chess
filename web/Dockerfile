FROM node:20.12.2 AS node_builder

WORKDIR /web

COPY web/package.json package.json
COPY web/package-lock.json package-lock.json

RUN npm install --package-lock-only

COPY web/ .

RUN npm run build



FROM nginx

COPY --from=node_builder /web/dist/ /var/www/chessautochess5/

COPY nginx.conf /etc/nginx/conf.d/vue.conf

EXPOSE 80

CMD /bin/sh -c "nginx -g 'daemon off;'"
