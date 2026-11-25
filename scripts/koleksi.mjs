import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const teks = value => typeof value === 'string' && value.trim() !== '';

export function pilihEntri(rows, kurasi, audioDir) {
  const ids = new Set();
  for (const e of rows) {
    if (!/^k\d+$/.test(e.id) || ids.has(e.id) || !teks(e.kata) || !teks(e.arti) ||
        !teks(e.sumber) || !['terbit', 'draf'].includes(e.status)) {
      throw new Error('Entri tidak valid atau ID ganda: ' + e.id);
    }
    ids.add(e.id);
    if (e.status === 'terbit' && (!teks(e.ragam) || !e.contoh || !e.audio)) {
      throw new Error('Entri terbit belum lengkap: ' + e.id);
    }
    if (e.contoh && (!teks(e.contoh.konjo) || !teks(e.contoh.indonesia))) {
      throw new Error('Contoh perlu teks dan terjemahan: ' + e.id);
    }
    if (e.audio) {
      const file = e.audio.berkas;
      if (typeof file !== 'string' || !/^[a-z0-9_-]+\.mp3$/.test(file) ||
          !teks(e.audio.kredit) || !existsSync(join(audioDir, file)) ||
          !statSync(join(audioDir, file)).isFile()) {
        throw new Error('Berkas atau kredit audio tidak valid: ' + e.id);
      }
    }
  }
  return rows.filter(e => kurasi || e.status === 'terbit');
}
