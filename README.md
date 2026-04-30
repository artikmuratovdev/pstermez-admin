# PS Termiz Admin

PS Termiz Admin - PS Termiz loyihasining kontent va boshqaruv jarayonlari uchun ishlab chiqilgan admin panel. Loyiha administratorlarga yangiliklar, kategoriyalar, jamoa a'zolari va admin foydalanuvchilarni yagona interfeys orqali boshqarish imkonini beradi.

## Loyiha maqsadi

Loyihaning asosiy maqsadi PS Termiz platformasi uchun ichki boshqaruv panelini yaratishdir. Admin panel orqali kontentni tezkor qo'shish, tahrirlash, o'chirish, foydalanuvchi rollarini nazorat qilish va autentifikatsiya qilingan adminlar uchun xavfsiz ish muhitini ta'minlash ko'zda tutilgan.

## Asosiy imkoniyatlar

- Admin autentifikatsiyasi va token asosida himoyalangan sahifalar.
- Access token muddati tugaganda refresh token orqali sessiyani yangilash.
- Admin foydalanuvchilarni boshqarish.
- Kategoriyalarni yaratish, tahrirlash va o'chirish.
- Yangiliklarni ro'yxatlash, ko'rish, yaratish, tahrirlash va o'chirish.
- Jamoa a'zolarini boshqarish.
- Media fayllarni yuklash va forma ichida ko'rib chiqish.
- Foydalanuvchi profili va parol sozlamalarini yangilash.
- Superuser roli uchun alohida boshqaruv bo'limlari.

## Texnologiyalar

- React
- TypeScript
- Vite
- React Router
- Redux Toolkit Query
- Tailwind CSS
- shadcn/ui va Radix UI komponentlari
- Lucide React ikonkalari
- Zod

## Loyiha tuzilmasi

```text
src/
  app/
    api/          API endpointlar va RTK Query konfiguratsiyasi
    store.ts      Redux store sozlamalari
  components/     Umumiy UI komponentlar va sidebar
  hooks/          Qayta ishlatiladigan React hooklar
  lib/            Auth va yordamchi funksiyalar
  pages/          Admin panel sahifalari
  routes/         Router va private route sozlamalari
```

## Muhit sozlamalari

Loyiha backend API bilan ishlashi uchun `.env` faylida quyidagi o'zgaruvchi bo'lishi kerak:

```env
VITE_API_BASE_URL=https://api-manzil.example
```

## Ishga tushirish

Kerakli paketlarni o'rnatish:

```bash
yarn install
```

Development rejimida ishga tushirish:

```bash
yarn dev
```

Production build yaratish:

```bash
yarn build
```

Build natijasini lokal ko'rish:

```bash
yarn preview
```

## Skriptlar

- `yarn dev` - Vite development serverini ishga tushiradi.
- `yarn build` - TypeScript tekshiruvi va production build yaratadi.
- `yarn lint` - ESLint orqali kodni tekshiradi.
- `yarn preview` - build qilingan loyihani lokal serverda ko'rsatadi.

## Qisqa mazmun

PS Termiz Admin administratorlar uchun mo'ljallangan boshqaruv paneli bo'lib, platformadagi asosiy ma'lumotlar va kontent ustidan nazoratni soddalashtiradi. Loyiha xavfsiz autentifikatsiya, rolga asoslangan ko'rinishlar va REST API bilan integratsiya qilingan CRUD amallariga tayangan holda ishlab chiqilgan.
