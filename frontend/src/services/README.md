# Service Structure

Each feature exposes its API connectors from its own folder.

```
services/
  auth/
    index.ts   # authentication calls
  users/
    index.ts   # user profile related calls
```

Only functions required by other modules are exported from each folder. Less frequently used services can be loaded lazily via dynamic `import()` calls.
