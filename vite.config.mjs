import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { pilihEntri } from './scripts/koleksi.mjs';

const data = fileURLToPath(new URL('./data/entri.json', import.meta.url));
const audioDir = fileURLToPath(new URL('./public/audio/', import.meta.url));
const modul = 'virtual:koleksi';

export default defineConfig(({ command, mode }) => {
  const kurasi = command === 'serve' && mode === 'kurasi';
  const baca = () => pilihEntri(JSON.parse(readFileSync(data, 'utf8')), kurasi, audioDir);
  return {
    base: './',
    publicDir: false,
    plugins: [{
      name: 'koleksi-konjo',
      resolveId(id) { if (id === modul) return '\0' + modul; },
      load(id) {
        if (id !== '\0' + modul) return;
        this.addWatchFile(data);
        return 'export const kurasi=' + kurasi + ';export const entri=' + JSON.stringify(baca());
      },
      configureServer(server) {
        server.middlewares.use('/audio', (req, res, next) => {
          const file = req.url?.split('?')[0].slice(1);
          if (!baca().some(e => e.audio && e.audio.berkas === file)) return next();
          res.setHeader('Content-Type', 'audio/mpeg');
          res.end(readFileSync(audioDir + file));
        });
      },
      generateBundle() {
        const files = new Set(baca().flatMap(e => e.audio ? [e.audio.berkas] : []));
        for (const file of files) {
          this.emitFile({ type: 'asset', fileName: 'audio/' + file, source: readFileSync(audioDir + file) });
        }
      }
    }]
  };
});
