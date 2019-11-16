# WebExtensions Schema

Lets you programmatically consume the WebExtensions Schema JSON files

## Usage

```ts
import webExtensionsSchema from 'webextensions-schema';

(async () => {
  const schema = await webExtensionsSchema();
  schema.getRaw();
  schema.getNamespaces();
})();
```

## API

### webExtensionsSchema(options)

- Arguments
  - `{Object}` options
    - `tag` [Any tag from mozilla-unified is valid](https://hg.mozilla.org/mozilla-unified/tags). Defaults to `FIREFOX_70_0_1_RELEASE`

Returns the `schema` instance

### schema.getRaw

Returns `Map` with schema filename as key and parsed JSON as content


### schema.getNamespaces

Returns `Map` with namespace name as key and parsed JSON, combined with manifest
if present, as content