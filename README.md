## Update cloud function permissions

Go to https://console.cloud.google.com/functions/list?project=healthcare-f57e8

Click permissions

Add principal

Name it allUsers and add it as a cloud functions invoker

## Staging deploy

```
npm run build-staging && firebase deploy
```

# Production deploy

```
npm run build-production && firebase deploy
```

## Common errors

### Domain not whitelisted by project (auth/unauthorized-continue-uri)

Open the firebase console for this env
Go to authentication -> settings -> Authorized domains and add the domain

## updating the database

To update the schema of the database run:

```
mysql -h [host] -P [port] -u[user] -p < setup_medthread_db.sql
```

If you want to make a change to an existing column, make sure to add the column first, migrate over all the data, and then delete the column.

Always try on staging first.

## Dump schema

Dump the schema from the database (even if its running in docker)

```
mysqldump -h localhost -P 3308 -u [user] -p --no-data [db name] --protocol=tcp > schema.sql
```
