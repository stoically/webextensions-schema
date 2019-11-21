# WebExtensions Schema

Programmatically consume the WebExtensions Schema JSON files. Defaults to the latest stable ones.

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
    - `tag` Any tag, except `tip`, [from mozilla-unified](https://hg.mozilla.org/mozilla-unified/tags) is valid. Default: Automatically fetches the latest stable release tag from `download.mozilla.org`.

Schema files for a tag that don't exist in the [`.schemas`
directory](https://github.com/stoically/webextensions-schema/tree/master/.schemas)
are downloaded once and saved there for future calls. Already ships with some
schema files (feel free to PR to add newer ones).

Returns a `Promise` resolving to the `schema` instance.

### schema.raw()

Returns an `Object` with schema filename as key and parsed JSON as value.

Sample:

```js
{
  'tabs.json': [
    { namespace: 'manifest', types: [Array] },
    {
      namespace: 'tabs',
      ...
    }
  ]
}
```

### schema.namespaces()

Returns an `Object` with namespace name as key and an `Array` of namespaces as value.

Sample:

```js
{
  manifest: [
    { namespace: 'manifest', types: [Array] },
    { namespace: 'manifest', types: [Array] },
    ...
  ],
  tabs: [
    {
      namespace: 'tabs',
      functions: [
        [Object], [Object], [Object],
        ...
      ]
    }
  ]
}
```

### schema.tag()

Returns a `string` with tag name that was used for the `schema` instance.
