# Update cloud function permissions

# Go to https://console.cloud.google.com/functions/list?project=healthcare-f57e8

# Click permissions

# Add principal

# Name it allUsers and add it as a cloud functions invoker

# Staging deploy

```
npm run build-staging && firebase deploy
```

# Production deploy

```
npm run build-production && firebase deploy
```

####

Common errors

####

## Domain not whitelisted by project (auth/unauthorized-continue-uri)

# Open the firebase console for this env

# Go to authentication -> settings -> Authorized domains and add the domain
