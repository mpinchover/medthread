#!/bin/sh

export DEV_ENV=TEST
export PORT=3310
export HOST=localhost
export USER=root 
export PASSWORD=root
# check to see if the container with the name exists.
existingMySQLContainer=$(docker ps -a -q -f name="test-medthread-mysql-db")
if [ -z "$existingMySQLContainer" ]
then
    # conatiner has been found so tear it down for a clean database
    # echo "Found existing test medthread db " $existingMySQLContainer
    docker run --name test-medthread-mysql-db -d -p 3310:3306 -e MYSQL_ROOT_HOST=% -e MYSQL_ROOT_PASSWORD=root mysql:8 
    sleep 20
    existingMySQLContainer=$(docker ps -a -q -f name="test-medthread-mysql-db")
fi


docker cp setup_medthread_db.sql $existingMySQLContainer:/setup_medthread_db.sql
# run the docker container

docker exec -it $existingMySQLContainer bash -c "mysql -u root -proot < setup_medthread_db.sql" 
npm run test

# mysql -uroot -proot -h 127.0.0.1 -P 3308 < setup_medthread_db.sql
