#!/bin/bash
# Получаем значение переменной окружения
NGINX_USE_HTTPS=${NGINX_USE_HTTPS:-0}

# Путь к шаблону конфигурации Nginx
TEMPLATE_PATH="/etc/nginx/conf.d/default.conf.tpl"
# Путь к конечному файлу конфигурации Nginx
NGINX_CONF_PATH="/etc/nginx/conf.d/default.conf"

# Блок конфигурации для SSL
SSL_BLOCK=""

if [ "$NGINX_USE_HTTPS" -eq 1 ]; then
    SSL_BLOCK=$(cat <<EOF
listen 443 ssl;
ssl_certificate /etc/ssl/cert.pem;
ssl_certificate_key /etc/ssl/cert.key;
EOF
)
fi

# Замена плейсхолдера {{SSL_BLOCK}} на значение переменной SSL_BLOCK
sed "s|{{SSL_BLOCK}}|$SSL_BLOCK|" $TEMPLATE_PATH > $NGINX_CONF_PATH

echo "Nginx configuration generated with SSL: $NGINX_USE_HTTPS"
