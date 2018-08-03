/*
 * Copyright (C) 2014-present Cloudflare, Inc.

 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE file for details.
 */

'use strict';

const prototypal = require('es-class');
const auto = require('autocreate');
const Resource = require('../Resource');
const method = require('../method');

/**
 * Zones represents the /zones API endpoint.
 *
 * @class Zones
 * @hideconstructor
 * @extends Resource
 */
module.exports = auto(
  prototypal({
    extends: Resource,
    path: 'zones',
    hasBrokenPatch: true,
    includeBasic: ['browse', 'read', 'edit', 'add', 'del'],
    activationCheck: method({
      method: 'PUT',
      path: ':id/activation_check',
    }),
    purgeCache: method({
      method: 'DELETE',
      path: ':id/purge_cache',
    }),
  })
);
