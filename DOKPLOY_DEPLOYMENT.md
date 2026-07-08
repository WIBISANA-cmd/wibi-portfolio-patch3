# Deploy ke Dokploy

Project ini adalah frontend **Vite + React** yang hasil akhirnya berupa file statis di `dist/`.
Karena itu deployment yang paling stabil di Dokploy adalah memakai `Dockerfile` ini dan menjalankannya dengan `nginx`.

## File yang dipakai

- `Dockerfile`
- `nginx.conf`
- `.dockerignore`
- `docker-compose.yml` untuk uji lokal opsional

## Environment penting

Untuk frontend production, yang dibutuhkan saat **build** adalah:

```env
VITE_SANITY_PROJECT_ID=your-project-id
VITE_SANITY_DATASET=production
VITE_SANITY_API_VERSION=2024-10-01
```

Catatan penting:

- Variabel `VITE_*` dibaca saat proses `vite build`, bukan saat container sudah running.
- Jadi di Dokploy, variabel ini perlu tersedia sebagai **Build Args** atau build-time environment.
- `SANITY_API_TOKEN` tidak diperlukan untuk menjalankan frontend production ini.
- `SANITY_STUDIO_*` hanya diperlukan kalau Anda ingin menjalankan atau deploy Sanity Studio secara terpisah.

## Uji lokal dengan Docker

Jika ingin cek image dulu secara lokal:

```bash
docker compose up --build
```

Lalu buka:

```text
http://localhost:8080
```

## Langkah setup di Dokploy

1. Buat app baru dari repository ini.
2. Pilih metode deployment `Dockerfile`.
3. Pastikan build context adalah root project.
4. Set port container ke `80`.
5. Tambahkan build arguments berikut:

```text
VITE_SANITY_PROJECT_ID=your-project-id
VITE_SANITY_DATASET=production
VITE_SANITY_API_VERSION=2024-10-01
```

6. Deploy.

## Domain dan CORS Sanity

Setelah domain Dokploy aktif, tambahkan domain tersebut ke Sanity CORS Origins:

```text
https://your-domain.com
```

Kalau memakai subdomain Dokploy preview, tambahkan juga subdomain preview yang benar-benar dipakai.

## Tentang Sanity Studio

Repo ini memang berisi konfigurasi Sanity Studio, tetapi frontend utama tidak membutuhkan Studio untuk ikut hidup di container yang sama.

Rekomendasi:

- deploy frontend ini di Dokploy memakai `Dockerfile`
- deploy Sanity Studio secara terpisah dengan `npm run studio:deploy`

Dengan begitu container production tetap kecil, cepat build, dan lebih mudah dirawat.
