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
if [ ! -f dist/main.js ]; then
  echo "ERROR: dist/main.js not found. Contents of dist:"
  ls -laR dist 2>/dev/null || echo "(dist directory missing)"
  exit 1
fi
exec node dist/main.js
