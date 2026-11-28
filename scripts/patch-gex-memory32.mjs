import { readFileSync, writeFileSync } from 'node:fs';

const root = '/tmp/stellite-gex';
const kmemPath = root + '/crates/gex-kmem/src/lib.rs';
const buildPath = root + '/hosts/kernel/build.sh';
const glPath = root + '/guest/gl/gexgl.c';
let kmem = readFileSync(kmemPath, 'utf8');
let build = readFileSync(buildPath, 'utf8');
let gl = readFileSync(glPath, 'utf8');

function replaceBetween(source, start, end, replacement, label) {
  const a = source.indexOf(start);
  const b = source.indexOf(end, a + start.length);
  if (a < 0 || b < 0) throw new Error('GEX patch anchor not found: ' + label);
  return source.slice(0, a) + replacement + source.slice(b);
}

kmem = replaceBetween(
  kmem,
  '/// Pages of the memory64 process memory:',
  '/// Pages of the 32-bit process memory.',
  '',
  'remove memory64 page helper'
);
kmem = replaceBetween(
  kmem,
  '/// How many 64 KiB pages the calling process\'s memory has.',
  '/// Whether `at..at+len` is inside the calling process\'s memory.',
  `/// How many 64 KiB pages the calling process's memory has.
#[inline]
pub fn process_pages() -> PAddr {
    pages32() as u64
}

`,
  'use the 32-bit process memory'
);
kmem = replaceBetween(
  kmem,
  'pub unsafe fn pull(dst: *mut u8, src: PAddr, len: u32) {',
  '/// Copy `len` bytes from this memory into the calling process\'s.',
  `pub unsafe fn pull(dst: *mut u8, src: PAddr, len: u32) {
    let src = src as u32;
    unsafe {
        core::arch::asm!(
            "local.get {dst}",
            "local.get {src}",
            "local.get {len}",
            "memory.copy 0, 1",
            dst = in(local) dst,
            src = in(local) src,
            len = in(local) len,
        );
    }
}

`,
  'use memory32-only pull'
);
kmem = replaceBetween(
  kmem,
  'pub unsafe fn push(dst: PAddr, src: *const u8, len: u32) {',
  '/// Zero `len` bytes of the calling process\'s memory at `dst`.',
  `pub unsafe fn push(dst: PAddr, src: *const u8, len: u32) {
    let dst = dst as u32;
    unsafe {
        core::arch::asm!(
            "local.get {dst}",
            "local.get {src}",
            "local.get {len}",
            "memory.copy 1, 0",
            dst = in(local) dst,
            src = in(local) src,
            len = in(local) len,
        );
    }
}

`,
  'use memory32-only push'
);
kmem = replaceBetween(
  kmem,
  'pub unsafe fn zero(dst: PAddr, len: u32) {',
  '/// Read one `u64` out of the guest, via a copy:',
  `pub unsafe fn zero(dst: PAddr, len: u32) {
    let dst = dst as u32;
    unsafe {
        core::arch::asm!(
            "local.get {dst}",
            "i32.const 0",
            "local.get {len}",
            "memory.fill 1",
            dst = in(local) dst,
            len = in(local) len,
        );
    }
}

`,
  'use memory32-only zero'
);

const oldBuild = `P64=$(((16 << 30) / 65536))
ADD_MEMORY_MORE=1 node hosts/kernel/add-memory.mjs "$OUT" "$OUT.p32" env process 0 1
node hosts/kernel/add-memory.mjs "$OUT.p32" runtime/files/out/gex/gex_kernel$INFIX.wasm env process64 0 1 $P64 64
ADD_MEMORY_MORE=1 node hosts/kernel/add-memory.mjs "$OUT" "$OUT.p32" env process 0 0
node hosts/kernel/add-memory.mjs "$OUT.p32" runtime/files/out/gex/gex_kernel$INFIX.plain.wasm env process64 0 0 $P64 64
rm -f "$OUT.p32"
`;
const newBuild = `# This browser build deliberately uses a 32-bit guest linear memory.
# The pinned GEX kernel mixes wasm32 and memory64 in memory.copy, which
# WebAssembly validation rejects ("copying between memories of different type").
# AArch64 ELF execution remains 64-bit; guest virtual addresses are constrained
# to the wasm32 4-GiB address space for this build. Do not add process64 here.
node hosts/kernel/add-memory.mjs "$OUT" runtime/files/out/gex/gex_kernel$INFIX.wasm env process 0 1
node hosts/kernel/add-memory.mjs "$OUT" runtime/files/out/gex/gex_kernel$INFIX.plain.wasm env process 0 0
`;
if (!build.includes(oldBuild)) throw new Error('GEX patch anchor not found: remove process64 imports');
build = build.replace(oldBuild, newBuild);

// Fix the pinned guest GL source's duplicate thread-local context declaration.
const firstContextDecl = 'static GEXGL_TLS unsigned egl_wire_context;';
const laterContextBlock = '#define GEXGL_MAX_CONTEXTS 16\nstruct gexgl_context_state {';
const duplicateContextDecl = "static GEXGL_TLS unsigned egl_wire_context = GEXGL_MAX_CONTEXTS; /* this thread's; none */";
if (!gl.includes(firstContextDecl) || !gl.includes(laterContextBlock) || !gl.includes(duplicateContextDecl)) {
  throw new Error('GEX GL patch anchor not found: egl_wire_context declarations');
}
gl = gl.replace(firstContextDecl, '#define GEXGL_MAX_CONTEXTS 16\nstatic GEXGL_TLS unsigned egl_wire_context = GEXGL_MAX_CONTEXTS;');
gl = gl.replace(laterContextBlock, 'struct gexgl_context_state {');
gl = gl.replace(duplicateContextDecl, '/* egl_wire_context is defined above with its no-context sentinel. */');
if ((gl.match(/static GEXGL_TLS unsigned egl_wire_context/g) || []).length !== 1) {
  throw new Error('GEX GL patch did not leave exactly one egl_wire_context definition');
}

if (/memory\.copy [^\n]*, 2|memory\.copy 2,/.test(kmem) || /memory\.fill 2|memory\.size 2/.test(kmem)) {
  throw new Error('GEX patch left a memory64 instruction in gex-kmem');
}
writeFileSync(kmemPath, kmem);
writeFileSync(buildPath, build);
writeFileSync(glPath, gl);
console.log('Applied GEX wasm32-only memory patch and egl_wire_context duplicate-definition fix.');
