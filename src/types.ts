export interface SchemaRaw {
  [key: string]: NamespaceSchema[];
}

export interface SchemaNamespaces {
  [key: string]: NamespaceSchema;
}

export interface Schema {
  raw: SchemaRaw;
  namespaces: SchemaNamespaces;
}

export interface WebExtensionsSchemaOptions {
  tag?: string;
}

// ------------------------------------------------------------------------------------------------------
// https://github.com/jsmnbom/definitelytyped-firefox-webext-browser/blob/master/src/types/converter.d.ts

// MIT License

// Copyright (c) 2018 Jasmin Bom

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

export interface NamespaceSchema {
  namespace: string;
  description?: string;
  allowedContexts: string[];
  types?: TypeSchema[];
  $import?: string;
  functions?: TypeSchema[];
  properties?: Indexable<TypeSchema>;
  events?: TypeSchema[];
  permissions?: string[];
}

export interface NameDesc {
  name: string;
  description: string;
}

export type Enum = string | NameDesc;

export interface TypeSchema {
  id?: string;
  name?: string;
  $ref?: string;
  $extend?: string;
  $import?: string;
  parameters?: TypeSchema[];
  extraParameters?: TypeSchema[];
  deprecated?: boolean | string;
  unsupported?: boolean;
  returns?: TypeSchema;
  description?: string;
  optional?: boolean;
  functions?: TypeSchema[];
  events?: TypeSchema[];
  properties?: Indexable<TypeSchema>;
  patternProperties?: Indexable<TypeSchema>;
  choices?: TypeSchema[];
  enum?: Enum[];
  type?: string;
  isInstanceOf?: string;
  additionalProperties?: TypeSchema;
  minItems?: number;
  maxItems?: number;
  items?: TypeSchema;
  value?: unknown;
  async?: true | 'callback';
  converterTypeOverride?: string;
  converterAdditionalType?: string;
}

export interface Indexable<V> {
  [k: string]: V;
}
// ------------------------------------------------------------------------------------------------------
