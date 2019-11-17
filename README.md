# WebExtensions Schema

Programmatically consume the WebExtensions Schema JSON files

## Install

```
npm i webextensions-schema
```

## Usage

```ts
import webExtensionsSchema from 'webextensions-schema';

(async () => {
  const schema = await webExtensionsSchema();
  // do something with `schema`
})();
```

## API

### webExtensionsSchema([options])

- Arguments
  - `{Object}` options
    - `tag` [Any tag, except `tip`, from mozilla-unified is valid](https://hg.mozilla.org/mozilla-unified/tags). Defaults to `FIREFOX_70_0_1_RELEASE`

Ships with the schema files for `FIREFOX_70_0_1_RELEASE`. When another tag is
given, the appropriate schema files are downloaded once and cached for future
calls.

Returns `Promise` resolving to the `schema` instance

### schema.getRaw

Returns `Map` with schema filename as key and parsed JSON as content


### schema.getNamespaces

Returns `Map` with namespace name as key and parsed JSON, combined with manifest
if present, as content. Namespaces containing dots are automatically nested
into the `childs` property of the parent namespace.

### schema.getTag

Returns `string` with tag name that was used for the `schema` instance