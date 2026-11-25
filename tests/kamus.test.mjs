import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { cari } from '../src/kamus.ts';
import { pilihEntri } from '../scripts/koleksi.mjs';
import data from '../data/entri.json' with {type:'json'};

test('pencarian dua arah, kapitalisasi, sinonim dan urutan hasil', () => {
  assert.equal(cari(data, ' ruMAh ')[0].kata,'BOLA');
  assert.equal(cari(data,'cantik')[0].kata,'GAMMARA');
  assert.deepEqual(cari(data,'zz'),[]);
  assert.equal(cari(data,'')[0].kata,'ANTAMA');
  assert.deepEqual(cari(['TAB','AB','ABA'].map(kata=>({kata,arti:'uji'})),'ab').map(e=>e.kata),['AB','ABA','TAB']);
});

test('publikasi hanya memuat entri lengkap dengan rekaman yang ada', t => {
  const dir=mkdtempSync(join(tmpdir(),'konjo-'));
  t.after(()=>rmSync(dir,{recursive:true,force:true}));
  const draft = { ...data[0], status:'draf', contoh:null, audio:null };
  const entry={...draft,id:'k9999',status:'terbit',ragam:'uji',contoh:{konjo:'uji',indonesia:'uji'},audio:{berkas:'uji.mp3',kredit:'uji'}};
  assert.throws(()=>pilihEntri([entry],false,dir),/audio/);
  writeFileSync(join(dir,'uji.mp3'),'fixture');
  assert.deepEqual(pilihEntri([draft,entry],false,dir),[entry]);
  assert.deepEqual(pilihEntri([draft,entry],true,dir),[draft,entry]);
  assert.throws(()=>pilihEntri([{...entry,contoh:null}],false,dir),/lengkap/);
  assert.throws(()=>pilihEntri([draft,draft],true,dir),/ganda/);
});
