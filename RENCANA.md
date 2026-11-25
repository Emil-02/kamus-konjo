# Rencana Kamus Konjo Bersuara

Pembaca bisa mengetik kata Konjo atau arti Indonesianya di HP, membuka entri, lalu mendengar pelafalan penutur dan membaca contoh pemakaiannya. Target uji pertama adalah lima entri lengkap. Target koleksi awal adalah 50 kata sehari-hari yang sudah diperiksa bersama penutur.

## Titik awal dan pilihan teknis

Repo kuliah sudah punya pencarian dua arah, sepuluh pasangan kata dan arti, serta simulasi algoritma genetika. Sepuluh pasangan itu menjadi daftar calon entri. Saat mengulas kata pertama, tanyakan kepada penutur di daerah mana kata itu digunakan dan bagaimana ejaannya. Catat ragam yang disebutkan penutur. [Repo sumber](https://github.com/Emil-02/Rekayasa_Komputasional)

Usulan versi pertama memakai web statis dengan Vite, TypeScript, HTML, dan CSS. Untuk koleksi awal, browser cukup membaca JSON yang dihasilkan saat build. Pencarian mengutamakan kecocokan kata atau arti secara utuh, lalu awalan dan potongan teks. Abaikan perbedaan huruf kapital saat mencari dan pertahankan ejaan asli saat menampilkan hasil.

## Halaman dan alur pembaca

- **Kamus** memuat kolom pencarian dan daftar alfabetis. Setiap hasil menampilkan kata, arti singkat, dan ragam jika tersedia. Saat pencarian kosong, pembaca bisa menjelajah seluruh daftar.
- **Detail kata** memiliki tautan tetap berdasarkan ID, arti, asal penggunaan, contoh beserta terjemahan, dan tombol putar yang bisa dipakai lagi untuk mengulang audio.
- **Tentang kamus** menjelaskan wilayah cakupan, cara kata diperiksa, kredit sesuai pilihan penutur, dan cara mengusulkan koreksi dengan menyebut ID kata.

## Struktur proyek

| Lokasi | Isi dan tanggung jawab |
| --- | --- |
| `data/entri.json` | Daftar kerja editor. Sudah berisi sepuluh entri draf dari repo lama. |
| `src/` | Kode tampilan, pencarian, dan pemutar audio saat implementasi dimulai. |
| `public/audio/` | Rekaman yang sudah disetujui untuk dipublikasikan, misalnya `k0001-01.mp3`. |
| `tests/` | Pengujian pencarian, pemilihan entri terbit, dan kecocokan rujukan audio. |
| `RENCANA.md` | Cakupan, keputusan awal, dan kriteria selesai. |

### Format entri

ID tetap menghubungkan kata dengan rekaman dan tautan detail saat ejaan dikoreksi. Simpan `kata` dan `arti` sebagaimana tercantum di sumber sampai selesai ditinjau. Isi `ragam` dengan nama ragam atau wilayah penggunaan yang dikonfirmasi, `contoh` dengan pasangan teks Konjo dan terjemahan Indonesia, serta `audio` dengan lokasi berkas relatif dan kredit publik pilihan penutur. Nilai kosong menggunakan `null`.

Alur editor dimulai dari `draf`. Setelah penutur memeriksa ejaan, arti, ragam, contoh, dan rekaman serta menyetujui publikasi suara, editor mengganti status menjadi `terbit`. Build mengambil entri terbit saja dan memeriksa keberadaan file audionya. Catatan kontak dan persetujuan disimpan oleh pengelola di luar folder publik.

## Tahapan dan kriteria selesai

1. **Kurasi lima kata.** Mulai dari sepuluh kandidat yang tersedia. Pilih lima bersama penutur dan catat koreksi, contoh kalimat, terjemahan, serta pelafalannya. Jika satu kata berasal dari ragam lain, catat ragam tersebut sebelum memutuskan cakupan koleksi pertama.
2. **Buat prototipe di HP.** Pembaca dapat menemukan kelima kata melalui kata Konjo maupun arti Indonesia, membuka tautan detail secara langsung, dan mengulang rekaman. Uji juga kapitalisasi, hasil kosong, dan audio gagal dimuat.
3. **Uji dengan penutur dan pembelajar.** Minta penutur mencocokkan setiap rekaman dengan teksnya. Minta pembelajar mencari satu arti dan mendengar pengucapannya tanpa arahan. Catat bagian yang menyulitkan dan perbaiki sebelum menambah data.
4. **Siapkan koleksi 50 kata.** Tambahkan kelompok kosakata yang dipilih penutur. Rilis awal siap ketika 50 entri lolos pemeriksaan isi, semua contoh punya terjemahan, rekaman dapat diputar di HP, dan seluruh tautan detail bisa dibuka langsung.
