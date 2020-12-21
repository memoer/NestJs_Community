# docker build -t test-db-i .
docker run -d -p 5432:5432 --name test-db-c test-db-i
# redis
# docker run --name hakhak-redis -p 6379:6379 --network hakhak-comunity -d redis redis-server --appendonly yes