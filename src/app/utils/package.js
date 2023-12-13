import assert from 'node:assert/strict';
import pkg from '../../../package.json' assert { type: 'json' };

assert.ok(pkg?.version, '[package.json]: incorrect "version" field!');

export default pkg;
