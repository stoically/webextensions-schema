import assert from 'assert';
import webExtensionsSchema from '../src';

describe('WebExtensionsSchema', () => {
  it('should provide the raw schema', async () => {
    const schema = await webExtensionsSchema();
    const privacy = schema.raw()['privacy.json'];
    assert(Array.isArray(privacy));
  });

  it('should provide the schema namespaces', async () => {
    const schema = await webExtensionsSchema();
    const { privacy, manifest } = schema.namespaces();
    assert(privacy[0].namespace === 'privacy');
    assert(Array.isArray(manifest[0].types));
  });
});
