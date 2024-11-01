import { transformSync } from '@babel/core';
import { parse } from '@babel/parser';
import generate from '@babel/generator';

export class Compiler {
  constructor(options = {}) {
    this.options = options;
    this.cache = new Map();
  }

  async compile(source, filename) {
    const cacheKey = `${filename}:${source}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const ast = parse(source, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript']
    });

    const { code, map } = await this.transform(ast, filename);
    const result = { code, map, ast };
    
    this.cache.set(cacheKey, result);
    return result;
  }

  async transform(ast, filename) {
    const result = await transformSync(ast, {
      filename,
      presets: [
        ['@babel/preset-env', { targets: 'defaults' }],
        '@babel/preset-typescript',
        ['@babel/preset-react', { runtime: 'automatic' }]
      ],
      plugins: [
        '@babel/plugin-transform-runtime',
        'babel-plugin-macros'
      ]
    });

    return {
      code: result.code,
      map: result.map
    };
  }

  generateCode(ast) {
    return generate(ast, {
      sourceMaps: true,
      compact: this.options.minify
    });
  }
}