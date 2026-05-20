#!/bin/sh
set -e
echo "Running database migrations..."
NODE_ENV=production npx sequelize-cli db:migrate
if [ "$DB_SEED" = "true" ]; then
  echo "Running database seeders (DB_SEED=true)..."
  NODE_ENV=production npx sequelize-cli db:seed:all
else
  echo "Skipping seeders (set DB_SEED=true for first deploy)."
fi
echo "Starting API server..."
exec node dist/main.js