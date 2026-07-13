server {
    server_name dacha.sniper541.ru;

    root /opt/project/dacha.sniper541/site;
    index index.html index.htm;
    charset utf-8;

    access_log /var/log/nginx/dacha.sniper541.ru.access.log;
    error_log /var/log/nginx/dacha.sniper541.ru.error.log;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~ /\. {
        deny all;
    }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/dacha.sniper541.ru/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/dacha.sniper541.ru/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

}
server {
    if ($host = dacha.sniper541.ru) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    listen 80;
    server_name dacha.sniper541.ru;
    return 404; # managed by Certbot


}