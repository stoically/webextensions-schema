import assert from 'assert';
import webExtensionsSchema from '../src';

describe('WebExtensionsSchema', () => {
  it('should parse the schema files', async () => {
    const schema = await webExtensionsSchema();
    const privacy = schema.getRaw().get('privacy.json');
    assert(Array.isArray(privacy));
  });

  it('should convert the schema files into combined namespaces', async () => {
    const schema = await webExtensionsSchema();
    const privacy = schema.getNamespaces().get('privacy');
    assert(privacy?.manifest);
    assert(privacy?.namespace === 'privacy');
    assert(privacy?.childs?.get('network')?.namespace === 'privacy.network');
  });
});
