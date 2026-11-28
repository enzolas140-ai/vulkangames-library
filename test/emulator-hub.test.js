const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const hub = fs.readFileSync('emulators/index.html', 'utf8');
const settings = fs.readFileSync('emulators/settings.html', 'utf8');

test('emulator hub exposes separate emulator navigation and PS2 launch modes', () => {
  assert.match(hub, /href="\.\.\/">Jogos/);
  assert.match(hub, /href="\.\/">Emuladores/);
  assert.match(hub, /id="playPs2"/);
  assert.match(hub, /localStorage\.getItem\('vg\.launchMode'\)/);
  assert.match(hub, /ps2Frame/);
});

test('hub and settings scripts parse', () => {
  for (const html of [hub, settings]) {
    const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
    assert.ok(scripts.length);
    for (const script of scripts) assert.doesNotThrow(() => new vm.Script(script[1]));
  }
});

test('settings map real TabStationToo preferences and do not promise a RAM cap', () => {
  assert.match(settings, /pcsx2web\.renderer/);
  assert.match(settings, /pcsx2web\.upscale/);
  assert.match(settings, /pcsx2web\.picture/);
  assert.match(settings, /vg\.uiLanguage/);
  assert.match(settings, /vg\.launchMode/);
  assert.match(settings, /não podem reservar uma quantidade fixa de RAM física/);
});
