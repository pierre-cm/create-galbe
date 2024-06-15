# %PROJECT_NAME%

# Install

```bash
bun add %PROJECT_NAME%
```

## Config

```ts
const galbe = new Galbe({
  // ...
  plugin: {
    // ...
    "com.example.%PROJECT_NAME%": {
      // Plugin config goes here
    },
  },
})
```

# Usage

```ts
import plugin from "%PROJECT_NAME%"

const galbe = new Galbe()

galbe.use(plugin)

export default galbe
```
