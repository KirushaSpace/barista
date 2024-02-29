# barista

docker-compose build
docker-compose run barista_server alembic revision --autogenerate -m "mig"
docker-compose up