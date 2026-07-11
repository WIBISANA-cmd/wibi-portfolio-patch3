# Deploy Production

Project ini punya dua target production yang terpisah:

- frontend portfolio: deploy ke Dokploy memakai `Dockerfile` + `nginx`
- Sanity Studio admin: deploy ke Sanity Hosting memakai `sanity deploy`

Frontend dan Studio memang sengaja dipisah supaya website public tetap kecil dan stabil, sementara panel admin tetap memakai hosting resmi Sanity.

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

Untuk Sanity Studio production:

```env
SANITY_STUDIO_PROJECT_ID=your-project-id
SANITY_STUDIO_DATASET=production
SANITY_STUDIO_HOSTNAME=your-studio-hostname
```

Untuk deploy Studio non-interaktif di CI/CD:

```env
SANITY_AUTH_TOKEN=your-deploy-token
```

Catatan penting:

- Variabel `VITE_*` tetap bisa diberikan sebagai build args, tetapi image ini sekarang juga menulis `runtime-config.js` saat container start.
- Jadi di Dokploy, Anda bisa set `VITE_*` sebagai environment app biasa dan frontend akan membacanya saat runtime.
- Jika build args dan runtime env sama-sama ada, nilai runtime env akan diprioritaskan oleh browser.
- `SANITY_API_TOKEN` tidak diperlukan untuk menjalankan frontend production ini.
- `SANITY_STUDIO_*` dipakai oleh `sanity.config.ts` dan `sanity.cli.ts` untuk dev, build, dan deploy Studio.
- `SANITY_STUDIO_HOSTNAME` akan menghasilkan URL Studio production:

```text
https://<SANITY_STUDIO_HOSTNAME>.sanity.studio
```

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

6. Atau, jika lebih nyaman di Dokploy, set tiga nilai yang sama sebagai environment runtime app.
7. Deploy ulang.

## Deploy Sanity Studio ke production

1. Pastikan akun Sanity Anda punya akses project yang benar.
2. Jika deploy dari local, login dulu:

```bash
npx sanity login
```

3. Pastikan environment berikut sudah terisi:

```env
SANITY_STUDIO_PROJECT_ID=your-project-id
SANITY_STUDIO_DATASET=production
SANITY_STUDIO_HOSTNAME=your-studio-hostname
```

4. Deploy Studio:

```bash
npm run studio:deploy:prod
```

5. Setelah sukses, admin production akan tersedia di:

```text
https://your-studio-hostname.sanity.studio
```

Jika ingin deploy lewat CI/CD atau server tanpa login interaktif, set `SANITY_AUTH_TOKEN` dan jalankan command yang sama.

## Domain dan CORS Sanity

Setelah frontend Dokploy aktif, tambahkan domain frontend tersebut ke Sanity CORS Origins:

```text
https://your-domain.com
```

Kalau memakai subdomain Dokploy preview, tambahkan juga subdomain preview yang benar-benar dipakai.

Tambahkan juga origin Studio production:

```text
https://your-studio-hostname.sanity.studio
```

## Alur production yang direkomendasikan

1. Deploy frontend ke Dokploy dari `Dockerfile`
2. Pasang domain `portfolio.wibee.web.id` ke app Dokploy
3. Deploy Sanity Studio ke `https://<hostname>.sanity.studio`
4. Login ke Studio production untuk mengelola konten
5. Pastikan domain frontend dan Studio sudah masuk ke Sanity CORS Origins
