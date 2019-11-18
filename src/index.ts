import {
  WebExtensionsSchemaOptions,
  Schema,
  SchemaRaw,
  SchemaNamespaces,
} from './types';
import { DownloadParse } from './download-parse';

export class WebExtensionsSchema {
  private _schemas: Schema;
  private _tag: string;

  constructor({ schemas, tag }: { schemas: Schema; tag: string }) {
    this._schemas = schemas;
    this._tag = tag;
  }

  raw(): SchemaRaw {
    return this._schemas.raw;
  }

  namespaces(): SchemaNamespaces {
    return this._schemas.namespaces;
  }

  tag(): string {
    return this._tag;
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
