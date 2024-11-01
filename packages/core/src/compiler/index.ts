import { transform } from './transform';
import { bundle } from './bundle';
import type { CompilerOptions } from '../types';

export class Compiler {
  private options: CompilerOptions;

  constructor(options: CompilerOptions = {}) {
    this.options = options;
  }

  async compile(source: string, filename: string) {
    const transformed = await transform(source, {
      filename,
      ...this.options
    });

    return bundle(transformed, this.options);
  }
}