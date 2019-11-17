import {
  WebExtensionsSchemaOptions,
  Schema,
  SchemaRaw,
  SchemaNamespaces,
} from './types';
import { DownloadParse } from './download-parse';

export class WebExtensionsSchema {
  private schemas: Schema;

  constructor({ schemas }: { schemas: Schema }) {
    this.schemas = schemas;
  }

  getRaw(): SchemaRaw {
    return this.schemas.raw;
  }

  getNamespaces(): SchemaNamespaces {
    return this.schemas.namespaces;
  }
}

const webExtensionsSchema = async (
  options: WebExtensionsSchemaOptions = {}
): Promise<WebExtensionsSchema> => {
  const downloadParse = await new DownloadParse(options).run();
  const schemas = downloadParse.getSchemas();
  return new WebExtensionsSchema({ schemas });
};

export default webExtensionsSchema;
export * from './types';
