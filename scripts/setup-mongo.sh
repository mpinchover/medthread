#!/bin/sh

# check to see if the container with the name exists.
existingMongoDB=$(docker ps -a -q -f name="local-medthread-mongo-db")
if [ ! -z "$existingMongoDB" ]
then
    # conatiner has been found so tear it down for a clean database
    echo "Found existing local medthread db " $existingMongoDB
    docker rm -f $existingMongoDB
fi

# run the docker container
docker run -d -p 27020:27017 --name local-medthread-mongo-db mongo:latest --replSet rs0 
newlyCreatedDockerContainer=$(docker ps -a -q -f name="local-medthread-mongo-db")

# # set up replica server using mongo eval 
docker exec $newlyCreatedDockerContainer sh -c "mongo --eval 'rs.initiate();'"
