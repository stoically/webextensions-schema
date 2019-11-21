import assert from 'assert';
import webExtensionsSchema from '../src';

describe('WebExtensionsSchema', () => {
  it('should parse the schema files', async () => {
    const schema = await webExtensionsSchema();
    const privacy = schema.raw()['privacy.json'];
    assert(Array.isArray(privacy));
  });

  it('should convert the schema files into combined namespaces', async () => {
    const schema = await webExtensionsSchema();
    const privacy = schema.namespaces().privacy;
    assert(privacy?.manifest);
    assert(privacy?.namespace === 'privacy');
    assert(privacy?.childs?.network?.namespace === 'privacy.network');
  });
});
