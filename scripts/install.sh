#!/usr/bin/env bash
set -Eeuo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DOMAIN="dacha.sniper541.ru"

SITE_DIR="$PROJECT_DIR/site"
NGINX_SOURCE="$PROJECT_DIR/nginx/$DOMAIN"
NGINX_AVAILABLE="/etc/nginx/sites-available/$DOMAIN"
NGINX_ENABLED="/etc/nginx/sites-enabled/$DOMAIN"

if [[ "$EUID" -ne 0 ]]; then
    echo "Ошибка: запусти скрипт от root или через sudo."
    exit 1
fi

echo "======================================"
echo " Установка проекта $DOMAIN"
echo "======================================"
echo

echo "[1/6] Проверка структуры проекта"

if [[ ! -d "$SITE_DIR" ]]; then
    echo "Ошибка: не найден каталог сайта:"
    echo "$SITE_DIR"
    exit 1
fi

if [[ ! -f "$SITE_DIR/index.html" ]]; then
    echo "Ошибка: не найден файл:"
    echo "$SITE_DIR/index.html"
    exit 1
fi

if [[ ! -f "$NGINX_SOURCE" ]]; then
    echo "Ошибка: не найден nginx-конфиг:"
    echo "$NGINX_SOURCE"
    exit 1
fi

echo "OK"
echo

echo "[2/6] Настройка прав"

chown -R root:www-data "$PROJECT_DIR"
find "$PROJECT_DIR" -type d -exec chmod 755 {} \;
find "$PROJECT_DIR" -type f -exec chmod 644 {} \;
chmod +x "$PROJECT_DIR/scripts/install.sh"

echo "OK"
echo

echo "[3/6] Создание ссылок nginx"

ln -sfn "$NGINX_SOURCE" "$NGINX_AVAILABLE"
ln -sfn "$NGINX_AVAILABLE" "$NGINX_ENABLED"

echo "$NGINX_AVAILABLE -> $(readlink -f "$NGINX_AVAILABLE")"
echo "$NGINX_ENABLED -> $(readlink -f "$NGINX_ENABLED")"
echo

echo "[4/6] Проверка конфигурации nginx"

nginx -t
echo

echo "[5/6] Перезагрузка nginx"

systemctl reload nginx
echo "OK"
echo

echo "[6/6] Проверка сайта"

HTTP_CODE="$(
    curl -sS -o /dev/null -w '%{http_code}' \
    --resolve "$DOMAIN:443:127.0.0.1" \
    "https://$DOMAIN/" \
    -k || true
)"

echo "HTTP-код: $HTTP_CODE"

if [[ "$HTTP_CODE" == "200" ]]; then
    echo "Сайт работает."
else
    echo "Предупреждение: ожидался HTTP 200, получен $HTTP_CODE"
fi

echo
echo "Готово."
echo "Сайт: https://$DOMAIN"
echo "Корень сайта: $SITE_DIR"
echo "Конфиг nginx: $NGINX_SOURCE"
