#!/bin/bash

rm -rf /var/www/chessautochess5/env-config.js
touch /var/www/chessautochess5/env-config.js

if [[ ! -z $NGINX_USE_HTTPS ]]; then
  echo "window.__use_https = \"$NGINX_USE_HTTPS\";" >> /var/www/chessautochess5/env-config.js
fi