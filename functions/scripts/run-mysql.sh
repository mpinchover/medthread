#!/bin/sh
export DEV_ENV=DEV
export MEDTHREAD_PORT=3308
export MEDTHREAD_HOST=localhost
export MEDTHREAD_USER=root 
export MEDTHREAD_PASSWORD=root
export MEDTHREAD_DATABASE=medthread

# check to see if the container with the name exists.
existingMySQLContainer=$(docker ps -a -q -f name="local-medthread-mysql-db")
if [ -z "$existingMySQLContainer" ]
then
    # conatiner has been found so tear it down for a clean database
    echo "Did not find existing local medthread db " $existingMySQLContainer
    docker run --name local-medthread-mysql-db -d -p 3308:3306  -e MYSQL_ROOT_PASSWORD=root mysql:8 
    sleep 20
    existingMySQLContainer=$(docker ps -a -q -f name="local-medthread-mysql-db")
fi


docker cp setup_medthread_db.sql $existingMySQLContainer:/setup_medthread_db.sql
# run the docker container

docker exec -it $existingMySQLContainer bash -c "mysql -u root -proot < setup_medthread_db.sql" 
firebase emulators:start
# mysql -uroot -proot -h 127.0.0.1 -P 3308 < setup_medthread_db.sql
