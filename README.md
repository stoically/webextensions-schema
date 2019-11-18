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
    - `tag` [Any tag, except `tip`, from mozilla-unified is valid](https://hg.mozilla.org/mozilla-unified/tags)

By default, when no tag is given, the latest stable release tag is used.

Ships with the schema files for the following tags
- `FIREFOX_70_0_1_RELEASE`
- `FIREFOX_69_0_3_RELEASE`
- `FIREFOX_68_0_2_RELEASE`
- `FIREFOX_67_0_4_RELEASE`

If schema files for a tag don't exist, the appropriate schema files are
downloaded once and saved for future calls.

Returns a `Promise` resolving to the `schema` instance

### schema.getRaw

Returns a `Map` with schema filename as key and parsed JSON as content


### schema.getNamespaces

Returns a `Map` with namespace name as key and namespace values, combined with
manifest if present, as content. Namespaces containing dots are automatically
nested into the `childs` property of the parent namespace.

Sample:

```js
Map {
  },
  'privacy' => {
    namespace: 'privacy',
    permissions: [ 'privacy' ],
    manifest: { namespace: 'manifest', types: [Array] },
    childs: Map {
      'network' => [Object],
      'services' => [Object],
      'websites' => [Object]
    }
  },
```

### schema.getTag

Returns a `string` with tag name that was used for the `schema` instance