import { entri, kurasi } from 'virtual:koleksi';
import { cari, type Entri } from './kamus';

const main = document.querySelector<HTMLElement>('main')!;
let pencarian = '';

function el<K extends keyof HTMLElementTagNameMap>(tag: K, text = '', cls = '') {
  const node = document.createElement(tag);
  node.textContent = text;
  node.className = cls;
  return node;
}
function link(text: string, href: string, cls = '') {
  const a = el('a', text, cls);
  a.href = href;
  return a;
}
function daftar() {
  const hero = el('section', '', 'hero');
  hero.append(el('div', '', 'waves'), el('p', 'Konjo — Indonesia', 'eyebrow'), el('h1', 'Kamus Konjo Bersuara'));
  const label = el('label', 'Cari kata Konjo atau arti Indonesia', 'sr');
  label.htmlFor = 'cari';
  const field = el('div', '', 'field');
  const input = el('input');
  input.id = 'cari';
  input.type = 'search';
  input.placeholder = 'Cari kata atau artinya…';
  input.value = pencarian;
  field.append(el('i', '', 'magnifier'), input);
  hero.append(label, field);
  const section = el('section', '', 'collection');
  const heading = el('div', '', 'heading');
  const count = el('span', '', 'count');
  count.setAttribute('aria-live', 'polite');
  heading.append(el('h2', kurasi ? 'Koleksi kurasi' : 'Koleksi kata'), count);
  section.append(heading);
  if (kurasi) section.append(el('p', 'Pratinjau editor. Entri berlabel draf masih menunggu pemeriksaan penutur.', 'muted'));
  const list = el('ul', '', 'list');
  const kosong = el('p', '', 'empty');
  section.append(list, kosong);
  function filter() {
    pencarian = input.value;
    const hasil = cari(entri, pencarian);
    count.textContent = hasil.length + ' kata';
    list.replaceChildren();
    for (const e of hasil) {
      const item = el('li');
      const a = link('', '#kata/' + e.id);
      a.append(el('strong', e.kata), el('span', e.arti, 'arti'));
      if (e.status === 'draf') a.append(el('small', 'Draf', 'badge'));
      if (e.ragam) a.append(el('small', e.ragam, 'ragam'));
      item.append(a);
      list.append(item);
    }
    kosong.hidden = hasil.length > 0;
    kosong.textContent = entri.length ? 'Kata belum ditemukan. Coba potongan kata atau arti lainnya.' : 'Koleksi pertama sedang diperiksa bersama penutur.';
  }
  input.addEventListener('input', filter);
  filter();
  main.append(hero, section);
}
function detail(e: Entri) {
  const article = el('article');
  article.append(link('Kembali ke kamus', '#kamus'), el('p', e.status === 'draf' ? 'Entri draf' : 'Entri kamus', 'eyebrow'), el('h1', e.kata), el('p', e.arti, 'meaning'));
  article.append(el('h2', 'Pelafalan'));
  if (e.audio) {
    const audio = el('audio');
    audio.controls = true;
    audio.preload = 'none';
    audio.src = './audio/' + e.audio.berkas;
    const message = el('p', e.audio.kredit, 'muted');
    audio.addEventListener('error', () => {
      message.textContent = 'Rekaman gagal dimuat. Muat ulang halaman untuk mencoba lagi.';
    });
    article.append(audio, message);
  } else article.append(el('p', 'Rekaman penutur belum tersedia.'));
  article.append(el('h2', 'Contoh pemakaian'));
  if (e.contoh) article.append(el('blockquote', e.contoh.konjo), el('p', e.contoh.indonesia));
  else article.append(el('p', 'Contoh kalimat menunggu pemeriksaan penutur.'));
  article.append(el('h2','Asal kata'), el('p',e.ragam ?? 'Ragam dan wilayah penggunaan sedang dikonfirmasi.'), el('small',e.id + ' · ' + e.sumber,'muted'));
  main.append(article);
}
function render() {
  const hash = location.hash.slice(1);
  main.replaceChildren();
  const tentang = hash === 'tentang';
  document.querySelectorAll('nav a').forEach(a => {
    if (a.getAttribute('href') === (tentang ? '#tentang' : '#kamus')) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  if (tentang) {
    const article = el('article');
    article.append(el('h1', 'Tentang kamus'), el('p','Kamus ini mendokumentasikan kata Konjo, arti dalam bahasa Indonesia, dan pelafalan penutur. Wilayah penggunaan dicatat per entri setelah dikonfirmasi.'), el('h2','Kurasi bersama penutur'), el('p','Editor memeriksa ejaan, arti, wilayah penggunaan, dan contoh kalimat bersama penutur. Rekaman disertakan setelah penutur menyetujui publikasi dan memilih nama kredit.'), el('h2','Usulkan koreksi'), el('p','Sampaikan ID kata, usulan ejaan atau arti, serta wilayah penggunaannya kepada pengelola.'), link('Profil pengelola di GitHub','https://github.com/Emil-02'));
    main.append(article);
  } else if (hash.startsWith('kata/')) {
    const e = entri.find(row => row.id === hash.slice(5));
    if (e) detail(e);
    else main.append(el('h1', 'Entri tidak tersedia'), link('Kembali ke kamus', '#kamus'));
  } else daftar();
  document.title = main.querySelector('h1')?.textContent + (hash && hash !== 'kamus' ? ' · Kamus Konjo' : '');
}
window.addEventListener('hashchange', () => { render(); main.focus({preventScroll:true}); window.scrollTo(0,0); });
document.querySelector('.skip')?.addEventListener('click', e => { e.preventDefault(); main.focus(); });
render();
