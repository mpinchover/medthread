# Update cloud function permissions

Go to https://console.cloud.google.com/functions/list?project=healthcare-f57e8
Click permissions
Add principal
Name it allUsers and add it as a cloud functions invoker

# Staging deploy

```
npm run build-staging && firebase deploy
```

# Production deploy

```
npm run build-production && firebase deploy
```
