# Frontend Design Component Plan

## 1. shadcn/ui loyiha holati

- Framework: Vite + React + TypeScript.
- shadcn style: `radix-nova`.
- Icon library: `lucide-react`.
- UI alias: `@/components/ui`.
- Registry: `@shadcn`.
- Form va CRUD sahifalarda shadcn qoidasiga ko'ra `FieldGroup` + `Field` ishlatilishi kerak.

## 2. Loyihada mavjud shadcn/ui komponentlar

Bu komponentlar allaqachon `src/components/ui` ichida bor va qayta qo'shish shart emas:

- `avatar`
- `badge`
- `breadcrumb`
- `button`
- `card`
- `chart`
- `checkbox`
- `drawer`
- `dropdown-menu`
- `input`
- `label`
- `select`
- `separator`
- `sheet`
- `sidebar`
- `skeleton`
- `sonner`
- `table`
- `tabs`
- `toggle`
- `toggle-group`
- `tooltip`

## 3. API ekranlari uchun qo'shilishi kerak bo'lgan komponentlar

Quyidagi komponentlar CRUD, filter, form, delete confirmation va empty/loading/error holatlari uchun kerak bo'ladi:

- `form` - React Hook Form/Zod bilan validatsiyali formalar uchun.
- `field` - form layout, label, description va validation state uchun.
- `input-group` - search input, URL input, upload URL, iconli inputlar uchun.
- `textarea` - news `description`, `content` va uzun matn maydonlari uchun.
- `switch` - `isActive`, `international` kabi boolean maydonlar uchun.
- `dialog` - create/edit modal formalar uchun.
- `alert-dialog` - delete confirmation uchun.
- `pagination` - admin/category/news/team list paginatsiyasi uchun.
- `popover` - combobox, date/filter dropdown va qo'shimcha filterlar uchun.
- `command` - searchable select/combobox: category select, role select, admin search.
- `empty` - bo'sh list holatlari uchun.
- `alert` - server xatolari, forbidden/unauthorized xabarlar uchun.
- `scroll-area` - uzun table, modal yoki sheet content uchun.
- `radio-group` - status/type kabi cheklangan tanlovlarda kerak bo'lishi mumkin.

shadcn add command:

```bash
npx shadcn@latest add @shadcn/form @shadcn/field @shadcn/input-group @shadcn/textarea @shadcn/switch @shadcn/dialog @shadcn/alert-dialog @shadcn/pagination @shadcn/popover @shadcn/command @shadcn/empty @shadcn/alert @shadcn/scroll-area @shadcn/radio-group
```

## 4. Umumiy admin panel patternlari

- Page layout: `Sidebar`, `Breadcrumb`, `Card`, `Tabs`, `Separator`.
- List ekran: `Card` + `Table` + `Badge` + `DropdownMenu` + `Pagination`.
- Create/Edit form: `Dialog` yoki `Sheet` + `Form` + `Field` + `Input`/`Select`/`Textarea`/`Switch`.
- Delete action: `AlertDialog`.
- Loading: `Skeleton`.
- Empty state: `Empty`.
- API error: `Alert` yoki form field validation xabari.
- Success/error notification: `sonner`.
- Action buttons: `Button` + `lucide-react` icon, iconlarda `data-icon` ishlatish.

## 5. Auth ekranlari

### Login

Mavjud komponentlar:

- `Card`
- `Input`
- `Button`
- `Alert` kerak bo'lishi mumkin, hozir error text oddiy `p` bilan ko'rsatilgan.

Tavsiya:

- Login formasini `Form` + `Field` bilan qayta tartiblash.
- Backend validation error uchun `FieldDescription` yoki `Alert` ishlatish.

### Profile update: `PATCH /auth/update-me`

Kerakli komponentlar:

- `Card`
- `Form`
- `Field`
- `Input`
- `Button`
- `Alert`
- `sonner`

Maydonlar:

- `fullName`
- `email`

### Password update: `PATCH /auth/update-password`

Kerakli komponentlar:

- `Card`
- `Form`
- `Field`
- `Input`
- `Button`
- `Alert`
- `sonner`

Maydonlar:

- `old_password`
- `new_password`

## 6. Admin management: `/auth/admins`

### Admin list: `GET /auth/admins`

Kerakli komponentlar:

- `Card`
- `Table`
- `Badge`
- `DropdownMenu`
- `Button`
- `Skeleton`
- `Empty`
- `Alert`
- `Pagination`

Table ustunlari:

- Full name
- Email
- Role
- Created at
- Updated at
- Actions

### Admin create/update: `POST /auth/admins`, `PATCH /auth/admins/:id`

Kerakli komponentlar:

- `Dialog` yoki `Sheet`
- `Form`
- `Field`
- `Input`
- `Button`
- `Alert`
- `sonner`

Maydonlar:

- `fullName`
- `email`
- `password`

### Admin delete: `DELETE /auth/admins/:id`

Kerakli komponentlar:

- `AlertDialog`
- `Button`
- `sonner`

Role guard:

- Admin CRUD actionlari faqat `superuser` uchun ko'rsatiladi.
- `Badge` orqali `admin` va `superuser` role ko'rsatiladi.

## 7. Categories: `/categories`

### Category list: `GET /categories`

Kerakli komponentlar:

- `Card`
- `Table`
- `Badge`
- `Select`
- `Switch` yoki `Checkbox`
- `DropdownMenu`
- `Button`
- `Skeleton`
- `Empty`
- `Alert`
- `Pagination`

Filterlar:

- `type`
- `isActive`

Table ustunlari:

- Name
- Slug
- Type
- Active
- Actions

### Category create/update: `POST /categories`, `PATCH /categories/:id`

Kerakli komponentlar:

- `Dialog` yoki `Sheet`
- `Form`
- `Field`
- `Input`
- `Select`
- `Switch`
- `Button`
- `Alert`
- `sonner`

Maydonlar:

- `name`
- `slug`
- `type`
- `isActive`

### Category delete: `DELETE /categories/:id`

Kerakli komponentlar:

- `AlertDialog`
- `Button`
- `sonner`

## 8. News: `/news`

### News list: `GET /news`

Kerakli komponentlar:

- `Card`
- `Table`
- `Badge`
- `Avatar` yoki media thumbnail uchun oddiy image wrapper
- `Select`
- `Popover`
- `Command`
- `DropdownMenu`
- `Button`
- `Skeleton`
- `Empty`
- `Alert`
- `Pagination`

Filterlar:

- `category`
- `status`
- `type`

Table ustunlari:

- Title
- Category
- Type
- Status
- Views
- Created by
- Actions

### News detail: `GET /news/:id`

Kerakli komponentlar:

- `Card`
- `Badge`
- `Separator`
- `Avatar`
- `Skeleton`
- `Alert`

Ko'rsatiladigan data:

- Title
- Slug
- Category
- Description
- Content
- Media preview
- Status
- Views

### News create/update: `POST /news`, `PATCH /news/:id`

Kerakli komponentlar:

- `Sheet` yoki keng `Dialog`
- `Form`
- `Field`
- `Input`
- `Textarea`
- `Select`
- `Popover`
- `Command`
- `InputGroup`
- `Button`
- `Alert`
- `sonner`

Maydonlar:

- `title`
- `slug`
- `type`
- `category`
- `description`
- `content`
- `media.type`
- `media.url`
- `media.thumbnail`
- `media.duration`
- `media.size`
- `media.mimeType`
- `status`

Upload flow:

- `Input` type file yoki custom file picker.
- Upload natijasidagi `file_path` qiymati `media.url` yoki `media.thumbnail`ga yoziladi.
- Upload davomida `Button` disabled + spinner pattern ishlatiladi.

### News delete: `DELETE /news/:id`

Kerakli komponentlar:

- `AlertDialog`
- `Button`
- `sonner`

## 9. Team: `/team`

### Team list: `GET /team`

Kerakli komponentlar:

- `Card`
- `Table`
- `Avatar`
- `Badge`
- `Select`
- `Switch` yoki `Checkbox`
- `DropdownMenu`
- `Button`
- `Skeleton`
- `Empty`
- `Alert`
- `Pagination`

Filterlar:

- `role`
- `international`

Table ustunlari:

- Avatar
- Name
- Email
- Role
- Subject
- International
- Country
- Actions

### Team detail: `GET /team/:id`

Kerakli komponentlar:

- `Card`
- `Avatar`
- `Badge`
- `Separator`
- `Skeleton`
- `Alert`

### Team create/update: `POST /team`, `PATCH /team/:id`

Kerakli komponentlar:

- `Dialog` yoki `Sheet`
- `Form`
- `Field`
- `Input`
- `Select`
- `Switch`
- `InputGroup`
- `Button`
- `Alert`
- `sonner`

Maydonlar:

- `name`
- `email`
- `avatar`
- `role`
- `subject`
- `international`
- `country`

Role select qiymatlari:

- `administration`
- `teacher`
- `international_teacher`
- `educator`

Upload flow:

- Avatar upload uchun `Input` type file.
- Upload natijasidagi `file_path` qiymati `avatar`ga yoziladi.

### Team delete: `DELETE /team/:id`

Kerakli komponentlar:

- `AlertDialog`
- `Button`
- `sonner`

## 10. Upload: `/upload/file`, `/upload/files`

Kerakli komponentlar:

- `Input` type file
- `InputGroup`
- `Button`
- `Progress` kerak bo'lishi mumkin, lekin oddiy upload uchun shart emas.
- `Alert`
- `sonner`

Qo'shimcha tavsiya:

- Agar upload progress UI kerak bo'lsa, `progress` komponentini ham qo'shish mumkin.

Optional add command:

```bash
npx shadcn@latest add @shadcn/progress
```

## 11. Minimal install ro'yxati

Avval shu komponentlarni qo'shish yetarli:

```bash
npx shadcn@latest add @shadcn/form @shadcn/field @shadcn/input-group @shadcn/textarea @shadcn/switch @shadcn/dialog @shadcn/alert-dialog @shadcn/pagination @shadcn/popover @shadcn/command @shadcn/empty @shadcn/alert @shadcn/scroll-area @shadcn/radio-group
```

Keyin real UI yozishda kerak bo'lsa qo'shiladi:

```bash
npx shadcn@latest add @shadcn/progress
```

## 12. Amalga oshirilgan design komponent ishlari

- [x] `field`, `input-group`, `textarea`, `switch`, `dialog`, `alert-dialog`, `pagination`, `popover`, `command`, `empty`, `alert`, `scroll-area`, `radio-group` komponentlari qo'shildi.
- [x] Login formasi `FieldGroup` + `Field` patterniga moslandi.
- [x] Auth profile va password formalarida `Card`, `Field`, `Input`, `Alert`/validator xabarlari va `sonner` ishlatildi.
- [x] Admin management UI `Card`, `Table`, `Badge`, `Dialog`, `AlertDialog`, `Skeleton`, `Empty`, `sonner` bilan tayyorlandi.
- [x] Categories UI `Table`, `Select`, `Switch`, `Dialog`, `AlertDialog`, `Badge` va filterlar bilan tayyorlandi.
- [x] News UI `Table`, `Select`, `Textarea`, `InputGroup`, upload flow, detail page va delete confirmation bilan tayyorlandi.
- [x] Team UI `Table`, `Avatar`, `Select`, `Switch`, avatar upload flow, detail page va delete confirmation bilan tayyorlandi.
- [x] Dashboard sidebar real CRUD sahifalarga ulandi.
- [x] Build tekshirildi: `npm.cmd run build`.
