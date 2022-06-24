import { promises as fs } from 'node:fs';
import path from 'node:path';
import { pipeline } from 'node:stream';
import { promisify } from 'node:util';
import fetch from 'node-fetch';
import unzipper from 'unzipper';
import stripJsonComments from 'strip-json-comments';
import { Schema, NamespaceSchema } from './types.js';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class DownloadParse {
  private _tag!: string;
  private tagDir!: string;
  private readonly mozRepo = 'mozilla-unified';
  private readonly mozArchiveURL =
    'https://hg.mozilla.org/mozilla-unified/archive';
  private readonly mozLatestFxURL =
    'https://download.mozilla.org/?product=firefox-latest&os=linux64&lang=en-US';
  private readonly outDir = path.join(__dirname, '..', '.schemas');
  private readonly schemaTypes = ['browser', 'toolkit'];
  private readonly schemasDir = ['components', 'extensions', 'schemas'];
  private readonly schemas: Schema = {
    raw: {},
    namespaces: {},
  };

  constructor({ tag }: { tag?: string } = {}) {
    if (tag) {
      this.tag = tag;
    }
  }

  set tag(tag: string) {
    this._tag = tag;
    this.tagDir = path.join(this.outDir, `${this.mozRepo}-${tag}`);
  }

  get tag(): string {
    return this._tag;
  }

  async run(): Promise<this> {
    if (!this.tag) {
      await this.fetchLatestStableTag();
    }
    if (!(await this.tagDirExists())) {
      await this.downloadSchemas();
    }

    await this.parseSchemas();
    this.extractNamespaces();

    return this;
  }

  getSchemas(): Schema {
    return this.schemas;
  }

  getTag(): string {
    return this.tag;
  }

  private extractNamespaces(): void {
    Object.values(this.schemas.raw).forEach((schemaJson) => {
      schemaJson.forEach((namespace) => {
        if (!this.schemas.namespaces[namespace.namespace]) {
          this.schemas.namespaces[namespace.namespace] = [];
        }
        this.schemas.namespaces[namespace.namespace].push(namespace);
      });
    });
  }

  private async parseSchemas(): Promise<void> {
    const unordered: {
      [key: string]: NamespaceSchema[];
    } = {};
    await Promise.all(
      this.schemaTypes.map(async (type) => {
        const dir = path.join(this.tagDir, type, ...this.schemasDir);
        const files = await fs.readdir(dir);

        await Promise.all(
          files.map(async (file) => {
            if (path.extname(file) !== '.json') {
              return;
            }

            const jsonBuffer = await fs.readFile(path.join(dir, file));
            const schema: NamespaceSchema[] = JSON.parse(
              stripJsonComments(jsonBuffer.toString())
            );
            unordered[file] = schema;
          })
        );
      })
    );

    Object.keys(unordered)
      .sort()
      .forEach((file) => {
        this.schemas.raw[file] = unordered[file];
      });
  }

  private async downloadSchemas(): Promise<void> {
    await Promise.all(
      this.schemaTypes.map((type: string) => this.downloadSchema(type))
    );
  }

  private async downloadSchema(type: string): Promise<void> {
    const url = this.getDownloadArchiveUrl(type);
    const response = await fetch(url);
    if (response.status !== 200) {
      throw new Error(
        `http status ${response.status} while trying to download ${url} - probably invalid tag name`
      );
    }

    if (!response.body) {
      throw new Error('http response with empty body');
    }

    const streamPipeline = promisify(pipeline);
    await streamPipeline(
      response.body,
      unzipper.Extract({ path: this.outDir })
    );
  }

  private async tagDirExists(): Promise<boolean> {
    try {
      await fs.access(this.tagDir);
      return true;
    } catch (error) {
      return false;
    }
  }

  private async fetchLatestStableTag(): Promise<void> {
    const response = await fetch(this.mozLatestFxURL, {
      method: 'HEAD',
      redirect: 'manual',
    });
    const location = response.headers.get('location');
    const [, release] =
      location?.match(/\/pub\/firefox\/releases\/([^/]+)\//) || [];

    if (!release) {
      throw new Error("Couldn't automatically resolve latest stable tag");
    }

    this.tag = `FIREFOX_${release.replace(/\./g, '_')}_RELEASE`;
  }

  private getDownloadArchiveUrl(type: string): string {
    return [
      this.mozArchiveURL,
      `${this.tag}.zip`,
      type,
      ...this.schemasDir,
    ].join('/');
  }
}
