#!/bin/sh
set -e
echo "Running database migrations..."
NODE_ENV=production npx sequelize-cli db:migrate
# только при первом деплое, потом строку можно убрать или закомментировать
echo "Running database seeders..."
NODE_ENV=production npx sequelize-cli db:seed:all
echo "Starting API server..."
exec node dist/main.js