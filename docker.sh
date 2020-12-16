# docker build -t test-db-i .
docker run -d -p 5432:5432 --name test-db-c test-db-i