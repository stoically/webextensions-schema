import {
  WebExtensionsSchemaOptions,
  Schema,
  SchemaRaw,
  SchemaNamespaces,
} from './types';
import { DownloadParse } from './download-parse';

class WebExtensionsSchemas {
  private schemas: Schema;

  constructor({ schemas }: { schemas: Schema }) {
    this.schemas = schemas;
  }

  getRaw(): SchemaRaw {
    return this.schemas.raw;
  }

  getAllNamespaces(): SchemaNamespaces {
    return this.schemas.namespaces;
  }
}

export default async (
  options: WebExtensionsSchemaOptions = {}
): Promise<WebExtensionsSchemas> => {
  const downloadParse = await new DownloadParse(options).run();
  const schemas = downloadParse.getSchemas();
  return new WebExtensionsSchemas({ schemas });
};
