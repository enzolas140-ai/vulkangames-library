const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const html = fs.readFileSync('index.html', 'utf8');
const inline = html.match(/<script>\s*([\s\S]*?)<\/script>/);
assert.ok(inline, 'inline application script exists');

test('application JavaScript parses', () => {
  assert.doesNotThrow(() => new vm.Script(inline[1]));
});

test('all eight systems use documented EmulatorJS system identifiers', () => {
  const match = inline[1].match(/const CORE=(\{[^\n]+\});/);
  assert.ok(match, 'CORE map exists');
  const core = vm.runInNewContext('(' + match[1] + ')');
  assert.deepEqual({ ...core }, {
    gb: 'gb', gbc: 'gb', gba: 'gba', nes: 'nes',
    snes: 'snes', megadrive: 'segaMD', psx: 'psx', nds: 'nds'
  });
});

test('game IDs are numeric and stable', () => {
  const match = inline[1].match(/function stableGameId\(system,title\)\{[\s\S]*?\n\}/);
  assert.ok(match, 'stableGameId exists');
  const fn = vm.runInNewContext('(' + match[0].replace('function stableGameId', 'function') + ')');
  assert.equal(typeof fn('gba', 'Homebrew test'), 'number');
  assert.equal(fn('gba', 'Homebrew test'), fn('gba', 'Homebrew test'));
  assert.notEqual(fn('gba', 'Homebrew test'), fn('psx', 'Homebrew test'));
});

test('local archives and multi-file CUE import are supported', () => {
  assert.match(html, /id="romFile"[^>]*multiple/);
  assert.match(inline[1], /ext\(name\)==='cue'/);
  assert.match(inline[1], /generateAsync\(\{type:'blob'\}\)/);
  assert.match(inline[1], /Arquivo referenciado pelo CUE não selecionado/);
});

test('BIOS selection accepts multiple files and ZIP packs', () => {
  assert.match(html, /id="biosFile"[^>]*multiple/);
  assert.match(inline[1], /biosUrl=URL\.createObjectURL\(f\)/);
  assert.match(inline[1], /files\.forEach\(x=>zip\.file\(x\.name,x\)\)/);
});

test('emulator shutdown and browser diagnostics are wired', () => {
  assert.match(inline[1], /EJS_terminate/);\n  assert.match(inline[1], /window\\.EJS_gameID=stableGameId\\(system,title\\)/);
  assert.match(inline[1], /function diagnostics\(\)/);
  assert.match(inline[1], /getGamepads/);
});
