const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const page = fs.readFileSync('index.html', 'utf8');
const catalog = JSON.parse(fs.readFileSync('catalog.json', 'utf8'));

test('library exposes a platform sidebar with separate console and HTML filters', () => {
  for (const system of ['psx', 'gba', 'gb', 'gbc', 'nes', 'snes', 'megadrive', 'nds', 'html']) {
    assert.match(page, new RegExp('data-system="' + system + '"'));
  }
  assert.match(page, /class="platform-sidebar"/);
  assert.match(page, /href="\.\/emulators\/ps2\/">/);
  assert.doesNotMatch(page, /id="system"/);
  assert.match(page, /function setCategory\(system\)/);
});

test('Mario Advance remains in the GBA section', () => {
  const mario = catalog.games.find(game => /Super Mario Advance 4/i.test(game.title));
  assert.ok(mario, 'Mario Advance entry exists');
  assert.equal(mario.system, 'gba');
  assert.match(mario.url, /super-mario-advance-4-gba\.zip$/);
});

test('Crash Bandicoot remains in the PS1 section and not among HTML games', () => {
  const crash = catalog.games.find(game => /Crash Bandicoot/i.test(game.title));
  assert.ok(crash, 'Crash Bandicoot entry exists');
  assert.equal(crash.system, 'psx');
  assert.doesNotMatch(crash.url, /\.html?(?:$|\?)/i);
});

test('HTML ports are categorized separately from console ROM systems', () => {
  const htmlGames = catalog.games.filter(game => game.type === 'html' || game.system === 'html');
  assert.ok(htmlGames.length > 0);
  assert.ok(htmlGames.every(game => game.system === 'html'));
});
