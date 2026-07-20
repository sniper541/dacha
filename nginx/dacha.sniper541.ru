server {
    server_name dacha.sniper541.com;

    root /opt/project/dacha.sniper541/site;
    index index.html index.htm;
    charset utf-8;

    access_log /var/log/nginx/dacha.sniper541.com.access.log;
    error_log /var/log/nginx/dacha.sniper541.com.error.log;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~ /\. {
        deny all;
    }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/dacha.sniper541.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/dacha.sniper541.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot


}
server {
    if ($host = dacha.sniper541.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    listen 80;
    server_name dacha.sniper541.com;
    return 404; # managed by Certbot


}