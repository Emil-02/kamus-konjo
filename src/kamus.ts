export interface Entri {
  id: string;
  kata: string;
  arti: string;
  status: 'draf' | 'terbit';
  sumber: string;
  ragam: string | null;
  contoh: { konjo: string; indonesia: string } | null;
  audio: { berkas: string; kredit: string } | null;
}

export function cari(entri: Entri[], kueri: string): Entri[] {
  const q = kueri.trim().toLocaleLowerCase('id');
  function skor(e: Entri) {
    if (!q) return 0;
    const bidang = [e.kata, e.arti, ...e.arti.split('/')].map(t => t.trim().toLocaleLowerCase('id'));
    if (bidang.includes(q)) return 0;
    if (bidang.some(v => v.startsWith(q))) return 1;
    return bidang.some(v => v.includes(q)) ? 2 : 3;
  }
  return entri.map(e => ({ e, nilai: skor(e) })).filter(r => r.nilai < 3)
    .sort((a,b) => a.nilai - b.nilai || a.e.kata.localeCompare(b.e.kata, 'id')).map(r => r.e);
}
