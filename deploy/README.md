# Деплой на VPS (Docker Compose + Caddy)

## 1. Клонирование

```bash
cd /opt
git clone https://github.com/RamiPalestinian/funeral-services.git funeral-services
cd funeral-services
```

## 2. Переменные окружения

```bash
cp .env.example .env
nano .env
```

Обязательно задайте `POSTGRES_*`, `DB_*` (те же значения), `JWT_*`, `GIGACHAT_API_KEY`, `HF_TOKEN`.
Для первого запуска: `DB_SEED=true`, после успешного старта — `DB_SEED=false`.

## 3. Запуск

```bash
docker compose up -d --build
docker compose ps
docker compose logs api -f
```

## 4. DNS

Записи A для `funeral-services.ru` и `www.funeral-services.ru` → IP сервера. Порты 80 и 443 открыты.

## 5. Проверка

- Сайт: https://funeral-services.ru
- API: https://funeral-services.ru/api/...
