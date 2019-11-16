import { promises as fs } from 'fs';
import path from 'path';
import request from 'request';
import unzipper from 'unzipper';
import stripJsonComments from 'strip-json-comments';
import { Schema, CombinedNamespaceSchema } from './types';

const DEFAULT_TAG = 'FIREFOX_70_0_1_RELEASE';

export class DownloadParse {
  private tag: string;
  private readonly mozillaUnifiedArchiveURL =
    'https://hg.mozilla.org/mozilla-unified/archive';
  private readonly outDir = path.join(__dirname, '..', 'downloads');
  private readonly schemasDir = 'components/extensions/schemas/';
  private readonly schemaTypes = ['browser', 'toolkit'];
  private releaseDir: string;
  private schemas: Schema = {
    raw: new Map(),
    namespaces: new Map(),
  };

  constructor({ tag }: { tag?: string } = {}) {
    this.tag = tag || DEFAULT_TAG;
    this.releaseDir = path.join(this.outDir, `mozilla-unified-${this.tag}`);
  }

  async run(): Promise<this> {
    if (!(await this.releaseDirExists())) {
      this.downloadSchemas();
    }

    await this.readSchemas();
    this.extractNamespaces();

    return this;
  }

  getSchemas(): Schema {
    return this.schemas;
  }

  private extractNamespaces(): void {
    const namespaces: CombinedNamespaceSchema[] = [];
    this.schemas.raw.forEach(schemaJson => {
      const manifest = schemaJson.find(
        ({ namespace }) => namespace === 'manifest'
      );

      schemaJson.forEach(namespace => {
        if (namespace.namespace === 'manifest') {
          return;
        }
        namespaces.push({
          ...namespace,
          manifest,
        });
      });
    });

    this.schemas.namespaces = new Map(
      namespaces
        .sort((a, b) =>
          a.namespace < b.namespace ? -1 : a.namespace > b.namespace ? 1 : 0
        )
        .map(namespace => [namespace.namespace, namespace])
    );
  }

  private async readSchemas(): Promise<void> {
    await Promise.all(
      this.schemaTypes.map(async type => {
        const dir = path.join(this.releaseDir, type, this.schemasDir);
        const files = await fs.readdir(dir);

        await Promise.all(
          files.map(async file => {
            if (path.extname(file) !== '.json') {
              return;
            }

            const jsonBuffer = await fs.readFile(path.join(dir, file));
            const schema = JSON.parse(stripJsonComments(jsonBuffer.toString()));
            this.schemas.raw.set(file, schema);
          })
        );
      })
    );
  }

  private downloadSchemas(): void {
    this.schemaTypes.map((type: string) =>
      request(this.getDownloadArchiveUrl(type)).pipe(
        unzipper.Extract({ path: this.outDir })
      )
    );
  }

  private async releaseDirExists(): Promise<boolean> {
    try {
      await fs.access(this.releaseDir);
      return true;
    } catch (error) {
      return false;
    }
  }

  private getDownloadArchiveUrl(type: string): string {
    return `${this.mozillaUnifiedArchiveURL}/${this.tag}.zip/${type}/${this.schemasDir}`;
  }
}
