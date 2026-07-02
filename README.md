# ChessAutoChess

Онлайн auto-chess. Оба игрока выставляют фигуры из доступного набора, а партию за них
доигрывает шахматный движок (Stockfish). Побеждает тот, чья стартовая расстановка
оказалась сильнее и продуманнее.

## Стек

- **Backend:** Python, Django 5, Django REST Framework, drf-spectacular (OpenAPI-схема)
- **Шахматный движок:** Stockfish (интеграция)
- **Frontend:** Vue.js (другой разработчик)
- **Инфраструктура:** Docker, docker-compose (dev/prod), Nginx

## Структура

- `app/` — Django-бэкенд: REST API, игровая логика, интеграция со Stockfish, OpenAPI-схема.
- `web/` — Vue.js SPA (фронтенд).
- `infrastructure/` — конфигурация деплоя.
- `compose-dev.yaml` / `compose-prod.yaml` — окружения для разработки и продакшена.

## Запуск (dev)

```bash
docker compose -f compose-dev.yaml up --build
```
