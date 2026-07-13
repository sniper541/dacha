# Любимая дача

Сайт гостевых домиков «Любимая дача» в Адыгее.

Сайт: https://dacha.sniper541.ru

![Главная страница](docs/screenshot.png)

## О проекте

Одностраничный адаптивный сайт с информацией о гостевых домиках, территории, кухне, бане, дополнительных услугах и отзывах гостей.

## Возможности

- адаптивная версия для компьютеров и мобильных устройств;
- фотогалереи на Swiper;
- полноэкранный просмотр фотографий;
- светлая и тёмная темы;
- разделы с домиками, территорией, кухней и баней;
- отзывы гостей;
- переход к бронированию через WhatsApp;
- HTTPS через Let's Encrypt.

## Структура проекта

    dacha.sniper541/
    ├── site/                         # файлы сайта
    │   ├── css/
    │   ├── img/
    │   ├── scripts/
    │   ├── favicon.png
    │   ├── index.html
    │   ├── package.json
    │   └── package-lock.json
    ├── nginx/
    │   └── dacha.sniper541.ru       # конфигурация nginx
    ├── scripts/
    │   └── install.sh               # установка проекта
    ├── docs/
    │   └── screenshot.png           # скриншот главной страницы
    ├── .gitignore
    └── README.md

## Развёртывание

Проект размещается в каталоге:

    /opt/project/dacha.sniper541

Установка или обновление конфигурации nginx:

    sudo ./scripts/install.sh

Скрипт установки:

- проверяет структуру проекта;
- создаёт ссылки на конфигурацию nginx;
- выполняет проверку nginx;
- перезагружает nginx;
- проверяет локальную доступность сайта.

## Nginx

Рабочий конфигурационный файл:

    /opt/project/dacha.sniper541/nginx/dacha.sniper541.ru

Корень сайта:

    /opt/project/dacha.sniper541/site

Системные ссылки nginx:

    /etc/nginx/sites-available/dacha.sniper541.ru
    /etc/nginx/sites-enabled/dacha.sniper541.ru

## Оптимизация изображений

Установка зависимостей:

    cd site
    npm install

Запуск оптимизации:

    npm run optimize:images

Каталог node_modules не хранится в Git.

## Технологии

- HTML5
- CSS3
- JavaScript
- Swiper.js
- Nginx
- Let's Encrypt
- Node.js
- Sharp

## Автор

Михаил Талызин

GitHub: https://github.com/sniper541
