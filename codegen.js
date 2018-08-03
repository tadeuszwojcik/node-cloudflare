'use strict';
const fs = require('fs');
const YAML = require('yaml').default;
const prettier = require('prettier');

const specs = fs.readFileSync('./routes.yaml').toString('utf8');

function push(out, str) {
  out.push(str);
}

function pushImport(out, pkg, as) {
  push(out, `const ${as} = require("${pkg}");`);
}

function pushCopyright(out) {
  push(
    out,
    `/*
 * Copyright (C) 2014-present Cloudflare, Inc.

 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE file for details.
 */`
  );
}

function pushJSDoc(out, spec) {
  push(out, '/**');
  push(out, ` * ${spec.name} represents the /${spec.path} API endpoint.`);
  push(out, ' *');
  push(out, ` * @class ${spec.name}`);
  push(out, ' * @hideconstructor');
  push(out, ' * @extends Resource');
  push(out, ' */');
}

function pushResource(out, spec) {
  push(out, "");
  pushJSDoc(out, spec);
  push(out, 'module.exports = auto(');
  push(out, '  prototypal({');
  push(out, '    extends: Resource,');
  push(out, `    path: '${spec.path}',`);

  if (spec.hasBrokenPatch) {
    push(out, `    hasBrokenPatch: ${spec.hasBrokenPatch},`);
  }

  if (spec.basic) {
    push(out, `    includeBasic: [${spec.basic.map(x => `'${x}'`).join(', ')}],`);
  }

  if (spec.methods) {
    Object.entries(spec.methods).map(entry => {
      const [name, def] = entry;

      push(out, `    ${name}: method({`);
      push(out, `      method: '${def.method}',`);
      if (def.path) {
        push(out, `      path: '${def.path}',`);
      }
      if (def.json) {
        push(out, `      json: ${def.json},`);
      }
      if (def.contentType) {
        push(out, `      contentType: '${def.contentType}',`);
      }
      push(out, '    }),');
    });
  }

  push(out, '  })');
  push(out, ');');
}

async function generateResource(spec) {
  const out = [];

  pushCopyright(out);
  push(out, '');
  push(out, "'use strict';");
  push(out, '');
  pushImport(out, 'es-class', 'prototypal');
  pushImport(out, 'autocreate', 'auto');
  pushImport(out, '../Resource', 'Resource');

  if (spec.methods) {
    pushImport(out, '../method', 'method');
  }

  pushResource(out, spec);

  let output = out.join('\n');
  let config = await prettier.resolveConfig('.', {
    useCache: true,
  });

  output = await prettier.format(output, config);

  return fs.promises.writeFile(`./lib/resources/${spec.name}.js`, Buffer.from(output));
}

async function generateResourcesIndex(specs) {
  const out = [];

  pushCopyright(out);
  push(out, '');
  push(out, "'use strict';");
  push(out, '');
  push(out, '/* eslint-disable global-require */');
  push(out, 'module.exports = {');
  specs.forEach(spec => {
    const doc = spec.toJSON();

    const value = doc.name;
    let key;

    if (doc.import) {
      key = doc.import;
    } else {
      key = value.charAt(0).toLowerCase() + value.substring(1);
    }

    push(out, `${key}: require('./${value}.js'),`);
  });
  push(out, '};');
  push(out, '/* eslint-enable global-require */');

  let output = out.join('\n');
  let config = await prettier.resolveConfig('.', {
    useCache: true,
  });

  output = await prettier.format(output, config);

  return fs.promises.writeFile('./lib/resources/index.js', Buffer.from(output));
}

const documents = YAML.parseAllDocuments(specs);

Promise.all(
  documents.map(spec => generateResource(spec.toJSON())),
  generateResourcesIndex(documents)
).then(() => {
  console.log('done!');
});
