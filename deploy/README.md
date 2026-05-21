# Деплой «Пантеон» (funeral-services) через Docker

Пошаговая инструкция: как поднять проект на VPS с **Docker Compose**, **PostgreSQL**, **NestJS API**, **Next.js** и **Caddy** (HTTPS + прокси).

Домен в примерах: **funeral-services.ru** (замените на свой, если другой).

---

## Кратко: что куда (кодом)

```text
Браузер
  → https://funeral-services.ru
       deploy/Caddyfile (proxy :80/:443)
            /api/*     → docker: api:3000     → server/ (NestJS)
            /*         → docker: web:3000     → client/ (Next.js)
            api        → docker: postgres     → БД (volume pgdata)
```

| Файл                          | Роль                                                      |
| ----------------------------- | --------------------------------------------------------- |
| `docker-compose.yml`          | 4 сервиса: `postgres`, `api`, `web`, `proxy`              |
| `.env` (корень)               | Секреты для compose + API (`POSTGRES_*`, `DB_*`, JWT, AI) |
| `deploy/Caddyfile`            | Маршруты домена → контейнеры                              |
| `server/Dockerfile`           | Сборка API → образ `api`                                  |
| `server/docker-entrypoint.sh` | migrate → seed? → `node dist/main.js`                     |
| `client/Dockerfile`           | Сборка Next → образ `web`                                 |
| `client/next.config.ts`       | `output: "standalone"` — лёгкий runtime в Docker          |
| `client/.env.local`           | Только локально (не в Docker, не в git)                   |

**Запрос пользователя:**

```text
GET https://funeral-services.ru/shop
  → Caddy → web:3000 → client/.next (Next)

GET https://funeral-services.ru/api/auth/login
  → Caddy → api:3000 → server/dist (Nest, префикс /api)
       → DB_HOST=postgres → контейнер postgres
```

### Client (`client/`) — что куда

```text
docker-compose.yml
  web:
    build: ./client
    args:
      NEXT_PUBLIC_API_URL: https://funeral-services.ru
         ↓
client/Dockerfile
  npm run build  →  .next/standalone + static
  CMD node server.js  →  контейнер web:3000
         ↓
Браузер открывает страницы client/src/app/
  /home, /shop, /card, /auth, /ai, /personal ...
         ↓
Запросы к API (не напрямую в api:3000!)
client/src/shared/lib/axiosInstance.ts
  baseURL = NEXT_PUBLIC_API_URL + '/api'
  → https://funeral-services.ru/api/...
  → снова Caddy → api
```

| Путь в `client/`                    | Роль                                        |
| ----------------------------------- | ------------------------------------------- |
| `src/app/`                          | Страницы (App Router): `page.tsx` = маршрут |
| `src/entities/`                     | Сущности: card, user, shop… + API thunks    |
| `src/features/`                     | Формы, UI-фичи (логин, профиль…)            |
| `src/shared/lib/axiosInstance.ts`   | Все HTTP-запросы на бэкенд                  |
| `src/shared/hooks/useReduxHooks.ts` | Redux в компонентах                         |
| `next.config.ts`                    | `standalone` для Docker-образа              |

**Локально vs прод:**

```env
# client/.env.local — только на ПК (npm run dev)
NEXT_PUBLIC_API_URL=http://localhost:3000

# прод — вшивается при docker build (compose build-arg)
NEXT_PUBLIC_API_URL=https://funeral-services.ru
```

Сменили домен → правка в `docker-compose.yml` (секция `web` → `args`) → `docker compose build web`.

**Переменные (сервер + API):**

```env
# docker-compose читает из корневого .env
POSTGRES_*  → контейнер postgres
env_file: .env → контейнер api (DB_HOST=postgres, не localhost)

# client на VPS — отдельного .env в client/ не нужно
# URL API задаётся только build-arg при сборке web
```

**На сервере одна команда после `.env`:**

```bash
cd /opt/funeral-services && docker compose up -d --build
```

Подробности — ниже по разделам.

---

## Содержание

0. [Кратко: что куда](#кратко-что-куда-кодом)
1. [Что получится в итоге](#1-что-получится-в-итоге)
2. [Архитектура](#2-архитектура)
3. [Что нужно заранее](#3-что-нужно-заранее)
4. [Подключение к серверу по SSH](#4-подключение-к-серверу-по-ssh)
5. [Установка Docker на VPS](#5-установка-docker-на-vps)
6. [Первый деплой: клонирование репозитория](#6-первый-деплой-клонирование-репозитория)
7. [Файл `.env` — переменные окружения](#7-файл-env--переменные-окружения)
8. [Запуск контейнеров](#8-запуск-контейнеров)
9. [DNS и HTTPS](#9-dns-и-https)
10. [Проверка работы](#10-проверка-работы)
11. [Обновление кода (git pull)](#11-обновление-кода-git-pull)
12. [Структура Docker-файлов в проекте](#12-структура-docker-файлов-в-проекте)
13. [Частые ошибки](#13-частые-ошибки)
14. [Полезные команды](#14-полезные-команды)

---

## 1. Что получится в итоге

| URL                                   | Куда идёт запрос                              |
| ------------------------------------- | --------------------------------------------- |
| `https://funeral-services.ru/`        | Next.js (фронт)                               |
| `https://funeral-services.ru/api/...` | NestJS (бэкенд)                               |
| База данных                           | PostgreSQL внутри Docker (снаружи не открыта) |

Пользователь заходит на сайт → Caddy принимает 80/443 → отдаёт статику/SSR с контейнера `web`, API проксирует на контейнер `api`.

---

## 2. Архитектура

```text
Интернет
    │
    ▼
┌─────────────────────────────────────┐
│  proxy (Caddy)  :80 / :443          │
│  deploy/Caddyfile                   │
└──────────┬──────────────┬───────────┘
           │              │
   /api/*  │              │  остальные пути
           ▼              ▼
    ┌──────────┐    ┌──────────┐
    │   api    │    │   web    │
    │ NestJS   │    │ Next.js  │
    │ :3000    │    │ :3000    │
    └────┬─────┘    └──────────┘
         │
         ▼
    ┌──────────┐
    │ postgres │
    │ :5432    │  (только внутри сети Docker)
    └──────────┘
```

**Почему так:** один вход (Caddy), автоматический HTTPS, API и фронт изолированы в контейнерах, БД не торчит в интернет.

---

## 3. Что нужно заранее

- VPS (Linux, Ubuntu/Debian), root или sudo.
- Домен **funeral-services.ru** (и при желании `www`).
- Репозиторий на GitHub: `https://github.com/RamiPalestinian/funeral-services`
- Для приватного репо — **Personal Access Token** (GitHub → Settings → Developer settings → Tokens).
- Ключи для AI (если нужен чат): `GIGACHAT_API_KEY`, `HF_TOKEN`.
- На ПК: SSH-клиент (PowerShell, PuTTY, терминал Cursor).

---

## 4. Подключение к серверу по SSH

На своём компьютере:

```bash
ssh root@ВАШ_IP_СЕРВЕРА
```

Пример:

```bash
ssh root@176.98.176.19
```

**Если `Permission denied`:**

- проверьте логин (`root` или пользователь из панели хостинга);
- в панели VPS сбросьте пароль или добавьте SSH-ключ;
- для `git clone` по HTTPS пароль = **PAT**, не пароль от GitHub.

---

## 5. Установка Docker на VPS

Один раз на чистом сервере:

```bash
apt update
apt install -y ca-certificates curl git nano
curl -fsSL https://get.docker.com | sh
```

Проверка:

```bash
docker --version
docker compose version
```

Должны вывести версии без ошибок.

---

## 6. Первый деплой: клонирование репозитория

### 6.1. Создать папку и клонировать

```bash
mkdir -p /opt/funeral-services
cd /opt/funeral-services
git clone https://github.com/RamiPalestinian/funeral-services.git .
```

Точка в конце — клон **в текущую папку**.

Git спросит логин/пароль:

- **Username:** ваш GitHub-логин (`RamiPalestinian`);
- **Password:** PAT (токен), не обычный пароль.

### 6.2. Если папка уже не пустая

Ошибка:

```text
fatal: destination path '.' already exists and is not an empty directory.
```

Значит репозиторий **уже склонирован**. Не делайте `git clone` снова — только обновление:

```bash
cd /opt/funeral-services
git status
git branch
git pull origin main
```

Если основная ветка — `dev`:

```bash
git pull origin dev
```

### 6.3. Переключиться на нужную ветку (если деплоите с `dev`)

```bash
git fetch origin
git checkout dev
git pull origin dev
```

---

## 7. Файл `.env` — переменные окружения

### 7.1. Где лежит файл

Файл **обязательно** в **корне** репозитория — рядом с `docker-compose.yml`:

```text
/opt/funeral-services/
├── docker-compose.yml
├── .env                 ← здесь
├── .env.example
├── server/
├── client/
└── deploy/
```

**Важно:** `.env` **не в git** (секреты). На сервере создаёте вручную.

`server/.env` — только для локальной разработки (`DB_HOST=localhost`). Docker Compose читает **корневой** `.env`.

### 7.2. Создать из шаблона

```bash
cd /opt/funeral-services
cp .env.example .env
nano .env
```

### 7.3. Полный пример `.env` с пояснениями

```env
# --- PostgreSQL (сервис postgres в docker-compose) ---
# Эти три переменные подставляются в контейнер БД при docker compose up
POSTGRES_USER=postgres
POSTGRES_PASSWORD=надёжный_пароль
POSTGRES_DB=postgres123

# --- API (NestJS) ---
PORT=3000
NODE_ENV=production

# Имя сервиса из docker-compose.yml — не localhost!
DB_HOST=postgres
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=надёжный_пароль
DB_NAME=postgres123

# JWT — в проде длинные случайные строки, не 123/456
JWT_ACCESS_SECRET=длинная_случайная_строка_1
JWT_REFRESH_SECRET=длинная_случайная_строка_2
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# AI (чат + RAG)
GIGACHAT_API_KEY=ваш_ключ_без_кавычек
HF_TOKEN=hf_ваш_токен

RAG_CHUNK_SIZE=500
RAG_TOP_P=3
KNOWLEDGE_BASE_PATH=./knowledge-base

# CORS — домен сайта через запятую
CORS_ORIGIN=https://funeral-services.ru,https://www.funeral-services.ru

# Сиды БД: true только при ПЕРВОМ запуске, потом false
DB_SEED=true
```

**Правила:**

| Переменная                            | Зачем                                                                    |
| ------------------------------------- | ------------------------------------------------------------------------ |
| `POSTGRES_*`                          | Создание БД в контейнере `postgres`                                      |
| `DB_*`                                | Подключение API к той же БД (`DB_HOST=postgres` — имя сервиса в compose) |
| `DB_USER` / `DB_PASSWORD` / `DB_NAME` | Должны совпадать с `POSTGRES_*`                                          |
| `DB_SEED=true`                        | Один раз заполнить тестовыми данными; после успешного старта → `false`   |
| `CORS_ORIGIN`                         | Иначе браузер заблокирует запросы с фронта к API                         |

### 7.4. Проверить, что Docker видит переменные

```bash
cd /opt/funeral-services
grep POSTGRES .env
docker compose config | grep POSTGRES
```

Не должно быть предупреждений вида `POSTGRES_USER variable is not set`.

### 7.5. Скопировать `.env` с ПК на сервер (альтернатива)

На **своём компьютере** (PowerShell), из папки проекта:

```powershell
scp .env root@ВАШ_IP:/opt/funeral-services/.env
```

Потом на сервере проверьте `grep POSTGRES .env`.

---

## 8. Запуск контейнеров

### 8.1. Сборка и старт

```bash
cd /opt/funeral-services

```

- `--build` — пересобрать образы `api` и `web`;
- `-d` — в фоне.

Первый запуск может занять **10–20 минут** (скачивание образов, `npm run build`).

### 8.2. Статус контейнеров

```bash
docker compose ps
```

Ожидаемо: `postgres`, `api`, `web`, `proxy` — **Up** (у `postgres` — healthy).

### 8.3. Логи API (миграции, сиды, ошибки)

```bash
docker compose logs api -f
```

Успешный старт:

```text
Running database migrations...
Running database seeders (DB_SEED=true)...   # только если DB_SEED=true
Starting API server...
```

После первого успешного деплоя откройте `.env` и поставьте:

```env
DB_SEED=false
```

Перезапуск API:

```bash
docker compose up -d api
```

### 8.4. Логи остальных сервисов

```bash
docker compose logs web -f
docker compose logs proxy -f
docker compose logs postgres
```

---

## 9. DNS и HTTPS

### 9.1. DNS у регистратора домена

Создайте **A-записи**:

| Имя   | Тип | Значение      |
| ----- | --- | ------------- |
| `@`   | A   | IP вашего VPS |
| `www` | A   | IP вашего VPS |

Подождите 5–60 минут (иногда до 24 ч).

### 9.2. Порты на сервере

Должны быть открыты **80** и **443** (фаервол панели хостинга / `ufw`).

```bash
ufw allow 80
ufw allow 443
ufw allow 22
ufw enable
```

### 9.3. Caddy и сертификаты

Файл `deploy/Caddyfile`:

```caddyfile
funeral-services.ru, www.funeral-services.ru {
	encode gzip

	@api path /api/*
	handle @api {
		reverse_proxy api:3000
	}

	@socket path /socket.io/*
	handle @socket {
		reverse_proxy api:3000
	}

	handle {
		reverse_proxy web:3000
	}
}
```

Caddy сам получит Let's Encrypt, когда DNS указывает на сервер и порты 80/443 доступны.

---

## 10. Проверка работы

1. В браузере: `https://funeral-services.ru` — главная, без ошибки сертификата.
2. Регистрация / вход — cookies и `/api` работают.
3. Корзина, каталог — данные с API.
4. Чат AI — нужны валидные `GIGACHAT_API_KEY` и `HF_TOKEN` в `.env`.

Проверка API с сервера:

```bash
curl -I https://funeral-services.ru/api
```

---

## 11. Обновление кода (git pull)

После правок в GitHub на сервере:

```bash
cd /opt/funeral-services
git pull origin dev
docker compose up -d --build
docker compose ps
docker compose logs api --tail 50
```

**Не используйте** повторный `git clone .` в непустую папку — только `git pull`.

Если изменили только `.env` (без кода):

```bash
docker compose up -d api
```

---

## 12. Структура Docker-файлов в проекте

### 12.1. `docker-compose.yml` (корень)

```yaml
services:
  postgres: # БД, volume pgdata
  api: # NestJS, build ./server, env_file: .env
  web: # Next.js, build ./client, NEXT_PUBLIC_API_URL
  proxy: # Caddy, порты 80/443
```

- `api` ждёт `postgres` (healthcheck).
- `web` собирается с `NEXT_PUBLIC_API_URL: https://funeral-services.ru` — URL API **вшивается при сборке** фронта.
- Если меняете домен — поменяйте URL в `docker-compose.yml` и пересоберите: `docker compose build web`.

### 12.2. `server/Dockerfile`

- Стадия **builder:** `npm ci` → `npm run build` → папка `dist`.
- Стадия **runner:** только production-зависимости + `dist`, миграции, `knowledge-base`.
- Запуск через `docker-entrypoint.sh`.

### 12.3. `server/docker-entrypoint.sh`

```sh
npx sequelize-cli db:migrate          # всегда
# db:seed:all — только если DB_SEED=true
node dist/main.js
```

### 12.4. `client/Dockerfile`

- Multi-stage: `npm run build` с `NEXT_PUBLIC_API_URL`.
- Режим `output: "standalone"` в `next.config.ts` — лёгкий runtime-образ.

### 12.5. Локальная разработка vs Docker

|           | Локально                                      | Docker на VPS                             |
| --------- | --------------------------------------------- | ----------------------------------------- |
| Файл env  | `server/.env`                                 | корневой `.env`                           |
| `DB_HOST` | `localhost`                                   | `postgres`                                |
| Фронт API | `client/.env.local` → `http://localhost:3000` | build-arg → `https://funeral-services.ru` |

---

## 13. Частые ошибки

### `POSTGRES_USER variable is not set`

Нет корневого `.env` или в нём нет `POSTGRES_*`. См. [раздел 7](#7-файл-env--переменные-окружения).

### `destination path '.' already exists`

Папка уже с клоном. Используйте `git pull`, не `git clone` ([6.2](#62-если-папка-уже-не-пустая)).

### Ошибка сборки `web` (TypeScript)

Исправьте на ПК, закоммитьте, `git pull` на сервере, снова `docker compose up -d --build`.

### API падает / не подключается к БД

- В `.env`: `DB_HOST=postgres` (не `localhost`).
- `DB_USER`, `DB_PASSWORD`, `DB_NAME` = тем же, что `POSTGRES_*`.
- Логи: `docker compose logs api`.

### Сайт открывается, API 502 / CORS

- Проверьте `CORS_ORIGIN` в `.env`.
- Caddy: `docker compose logs proxy`.
- DNS и HTTPS настроены?

### Сиды выполняются каждый раз / `admin@funeral.ru already exists`

Поставьте `DB_SEED=false` после первого деплоя. API в цикле Restarting из‑за `set -e` в entrypoint.

### `Cannot find module '/app/dist/main.js'`

Образ API собран без `dist/main.js`. На сервере:

```bash
git pull origin dev
docker compose build --no-cache api
docker compose up -d api
```

В `Dockerfile` есть проверка `test -f dist/main.js` — если сборка падает, смотрите лог `npm run build`.

### Потеря данных БД

Данные в volume `pgdata`. **`docker compose down -v` удалит БД** — не используйте `-v` без бэкапа.

---

## 14. Полезные команды

```bash
# Остановить всё
docker compose down

# Пересобрать один сервис
docker compose build api
docker compose up -d api

# Зайти в контейнер API
docker compose exec api sh

# Зайти в PostgreSQL
docker compose exec postgres psql -U postgres -d postgres123

# Место на диске
docker system df

# Очистить неиспользуемые образы (осторожно)
docker image prune -f
```

---

## Чеклист первого деплоя

- [ ] SSH на сервер работает
- [ ] Установлены Docker и Docker Compose
- [ ] `git clone` в `/opt/funeral-services` (или `git pull`, если уже есть)
- [ ] Создан `/opt/funeral-services/.env` с `POSTGRES_*`, `DB_HOST=postgres`, JWT, AI-ключи
- [ ] `DB_SEED=true` для первого запуска
- [ ] `docker compose up -d --build` без ошибок
- [ ] `docker compose ps` — все сервисы Up
- [ ] DNS A-записи на IP сервера
- [ ] Сайт открывается по HTTPS
- [ ] `DB_SEED=false` после успешного старта
- [ ] Сменены слабые JWT-секреты на длинные случайные

---

## Ссылки в репозитории

| Файл                          | Назначение                   |
| ----------------------------- | ---------------------------- |
| `docker-compose.yml`          | Описание всех сервисов       |
| `.env.example`                | Шаблон переменных            |
| `deploy/Caddyfile`            | Маршрутизация и HTTPS        |
| `server/Dockerfile`           | Образ API                    |
| `client/Dockerfile`           | Образ фронта                 |
| `server/docker-entrypoint.sh` | Миграции + опциональные сиды |

Если что-то пойдёт не так — сохраните вывод `docker compose logs api` и `docker compose ps` для разбора.
