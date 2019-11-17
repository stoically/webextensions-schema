import {
  WebExtensionsSchemaOptions,
  Schema,
  SchemaRaw,
  SchemaNamespaces,
} from './types';
import { DownloadParse } from './download-parse';

export class WebExtensionsSchema {
  private schemas: Schema;
  private tag: string;

  constructor({ schemas, tag }: { schemas: Schema; tag: string }) {
    this.schemas = schemas;
    this.tag = tag;
  }

  getRaw(): SchemaRaw {
    return this.schemas.raw;
  }

  getNamespaces(): SchemaNamespaces {
    return this.schemas.namespaces;
  }

  getTag(): string {
    return this.tag;
  }
}

const webExtensionsSchema = async (
  options: WebExtensionsSchemaOptions = {}
): Promise<WebExtensionsSchema> => {
  const downloadParse = await new DownloadParse(options).run();
  const schemas = downloadParse.getSchemas();
  const tag = downloadParse.getTag();
  return new WebExtensionsSchema({ schemas, tag });
};

export default webExtensionsSchema;
export * from './types';
