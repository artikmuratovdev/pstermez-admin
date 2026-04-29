# Backend and Frontend Task List

## 1. Backendda bajarilgan ishlar

- [x] Express `trust proxy` sozlamasida bo'sh `IP` env qiymati crash bermaydigan qilindi.
- [x] Auth login `AdminModel` orqali `email/password` bilan ishlaydigan qilindi.
- [x] Login response `access_token` va `refresh_token` qaytaradigan qilindi.
- [x] `POST /auth/refresh-token` route qo'shildi.
- [x] Refresh token `JWT_SECRET_REFRESH` bilan verify qilinadigan qilindi.
- [x] `authMiddleware` token egasini `AdminModel`dan topadigan qilindi.
- [x] Public superuser signup endpoint olib tashlandi.
- [x] `REG_KEY`ga bog'liq superuser signup logikasi olib tashlandi.
- [x] Superuser DB ga inject qilinishi uchun `src/scripts/inject-superuser.ts` tayyorlandi.
- [x] `npm run seed:superuser` script qo'shildi.
- [x] Superuser orqali admin CRUD endpointlari tayyorlandi.
- [x] Admin CRUD endpointlari `roleMiddleware([RoleConstants.SUPERUSER])` bilan himoyalandi.
- [x] Auth validatorlari admin login, refresh token, profile update, password update va admin CRUD uchun moslandi.
- [x] Auth swagger hujjatlari login, refresh token va admin CRUD endpointlariga moslandi.
- [x] Category CRUD controller, route, validator va swagger tayyorlandi.
- [x] News CRUD controller, route, validator va swagger tayyorlandi.
- [x] Team CRUD controller, route, validator va swagger tayyorlandi.
- [x] `GET /categories`, `GET /news`, `GET /team` public qilindi.
- [x] Category, news va team `POST/PATCH/DELETE` endpointlari auth bilan himoyalandi.
- [x] News yaratishda `createdBy` bodydan emas, token egasidan olinadigan qilindi.
- [x] Ishlatilmayotgan user route olib tashlandi.
- [x] Ishlatilmayotgan user controller, validator va swagger olib tashlandi.
- [x] `tsconfig.json`dan eski user exclude sozlamalari olib tashlandi.
- [x] `npm.cmd run build` bilan TypeScript build tekshirildi.

## 2. Frontendda bajarilishi kerak bo'lgan ishlar

- [ ] Auth API clientni yangi login responsega moslash: `access_token` va `refresh_token`.
- [ ] Token storage strategiyasini yangilash: access token va refresh token alohida saqlansin.
- [ ] API interceptor yoki fetch wrapper qo'shish: access token expired bo'lsa `POST /auth/refresh-token` chaqirilsin.
- [ ] Refresh token ham expired yoki invalid bo'lsa user logout qilinsin.
- [ ] Eski superuser signup sahifasi, linki yoki formasi bo'lsa olib tashlansin.
- [ ] Login formasi `email/password` yuborayotganini tekshirish.
- [ ] Auth state initializationda saqlangan tokenlar bilan session tiklanadigan qilish.
- [ ] Protected route logicni access token va refresh flowga moslash.
- [ ] Superuser uchun admin management sahifasini tayyorlash.
- [ ] Admin list UI: `GET /auth/admins`.
- [ ] Admin create UI: `POST /auth/admins`.
- [ ] Admin update UI: `PATCH /auth/admins/:id`.
- [ ] Admin delete UI: `DELETE /auth/admins/:id`.
- [ ] Admin CRUD actionlarini faqat `superuser` role uchun ko'rsatish.
- [ ] Category API service qo'shish.
- [ ] Category list sahifasi: `GET /categories`.
- [ ] Category create formasi: `POST /categories`.
- [ ] Category edit formasi: `PATCH /categories/:id`.
- [ ] Category delete action: `DELETE /categories/:id`.
- [ ] Category filterlarini ulash: `type`, `isActive`.
- [ ] News API service qo'shish.
- [ ] News list sahifasi: `GET /news`.
- [ ] News detail sahifasi: `GET /news/:id`.
- [ ] News create formasi: `POST /news`.
- [ ] News edit formasi: `PATCH /news/:id`.
- [ ] News delete action: `DELETE /news/:id`.
- [ ] News filterlarini ulash: `category`, `type`.
- [ ] News formada category select `GET /categories`dan to'ldirilsin.
- [ ] News media maydonlari backend schema bilan mos bo'lsin: `media[].type`, `media[].url`, `media[].thumbnail` faqat video uchun, `size`, `mimeType`.
- [ ] Upload endpointdan qaytgan file URL news media uchun ishlatiladigan qilish.
- [ ] Team API service qo'shish.
- [ ] Team list sahifasi: `GET /team`.
- [ ] Team detail sahifasi: `GET /team/:id`.
- [ ] Team create formasi: `POST /team`.
- [ ] Team edit formasi: `PATCH /team/:id`.
- [ ] Team delete action: `DELETE /team/:id`.
- [ ] Team filterlarini ulash: `role`, `international`.
- [ ] Team role select qiymatlarini backend enum bilan moslash: `administration`, `teacher`, `international_teacher`, `educator`.
- [ ] Team avatar uchun upload flow ulash.
- [ ] Swagger yoki API contract asosida frontend TypeScript typelarini yangilash.
- [ ] Barcha create/update formalarda backend validator xabarlarini UI da ko'rsatish.
- [ ] Public sahifalarda auth talab qilinmaydigan `GET` endpointlardan foydalanish.
- [ ] Admin panelda `POST/PATCH/DELETE` actionlar authorization header bilan yuborilishini tekshirish.
- [ ] Manual QA: login, refresh token, logout, admin CRUD, category CRUD, news CRUD, team CRUD.
- [ ] Production env konfiguratsiyasida API base URL va token refresh flow tekshirish.

## 3. Frontend uchun API contract

### 3.1. Auth

#### `POST /auth/login`

- Auth: kerak emas.
- Request body:

```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

- Success response `200`:

```json
{
  "success": true,
  "access_token": "jwt-access-token",
  "refresh_token": "jwt-refresh-token"
}
```

- Error response:

```json
{
  "success": false,
  "error": {
    "statusCode": 400,
    "statusMsg": "Bad Request",
    "msg": "Invalid email or password!"
  }
}
```

#### `POST /auth/refresh-token`

- Auth: kerak emas, body ichidagi refresh token ishlatiladi.
- Request body:

```json
{
  "refresh_token": "jwt-refresh-token"
}
```

- Success response `200`:

```json
{
  "success": true,
  "access_token": "new-jwt-access-token",
  "refresh_token": "new-jwt-refresh-token"
}
```

- Error response:

```json
{
  "success": false,
  "error": {
    "statusCode": 401,
    "statusMsg": "Unauthorized",
    "msg": "jwt expired"
  }
}
```

#### `GET /auth/me`

- Auth: `Authorization: Bearer <access_token>`.
- Request body: yo'q.
- Success response `200`:

```json
{
  "success": true,
  "data": {
    "_id": "adminId",
    "fullName": "Admin Name",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

#### `PATCH /auth/update-me`

- Auth: `Authorization: Bearer <access_token>`.
- Request body:

```json
{
  "fullName": "New Name",
  "email": "new@example.com"
}
```

- Success response `200`:

```json
{
  "success": true,
  "message": "Profile updated successfully"
}
```

#### `PATCH /auth/update-password`

- Auth: `Authorization: Bearer <access_token>`.
- Request body:

```json
{
  "old_password": "oldPass123",
  "new_password": "newPass123"
}
```

- Success response `200`:

```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

### 3.2. Admin management

#### `POST /auth/admins`

- Auth: faqat `superuser`.
- Request body:

```json
{
  "fullName": "Admin Name",
  "email": "admin@example.com",
  "password": "password123"
}
```

- Success response `201`:

```json
{
  "success": true,
  "message": "Admin created successfully"
}
```

#### `GET /auth/admins`

- Auth: faqat `superuser`.
- Request body: yo'q.
- Success response `200`:

```json
{
  "success": true,
  "data": [
    {
      "_id": "adminId",
      "fullName": "Admin Name",
      "email": "admin@example.com",
      "role": "admin",
      "created_at": "2026-04-28T00:00:00.000Z",
      "updated_at": "2026-04-28T00:00:00.000Z"
    }
  ]
}
```

#### `GET /auth/admins/:id`

- Auth: faqat `superuser`.
- Params: `id` MongoDB ObjectId.
- Success response `200`:

```json
{
  "success": true,
  "data": {
    "_id": "adminId",
    "fullName": "Admin Name",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

#### `PATCH /auth/admins/:id`

- Auth: faqat `superuser`.
- Params: `id` MongoDB ObjectId.
- Request body:

```json
{
  "fullName": "Updated Admin",
  "email": "updated@example.com",
  "password": "newPass123"
}
```

- Success response `200`:

```json
{
  "success": true,
  "message": "Admin updated successfully"
}
```

#### `DELETE /auth/admins/:id`

- Auth: faqat `superuser`.
- Params: `id` MongoDB ObjectId.
- Success response `200`:

```json
{
  "success": true,
  "message": "Admin deleted successfully"
}
```

### 3.3. Categories

#### `POST /categories`

- Auth: kerak.
- Request body:

```json
{
  "name": "Events",
  "slug": "events",
  "type": "news",
  "isActive": true
}
```

- Success response `201`:

```json
{
  "success": true,
  "data": {
    "_id": "categoryId",
    "name": "Events",
    "slug": "events",
    "type": "news",
    "isActive": true,
    "created_at": "2026-04-28T00:00:00.000Z",
    "updated_at": "2026-04-28T00:00:00.000Z"
  }
}
```

#### `GET /categories`

- Auth: kerak emas.
- Query params: `type`, `isActive`.
- Example: `/categories?type=news&isActive=true`
- Success response `200`:

```json
{
  "success": true,
  "data": [
    {
      "_id": "categoryId",
      "name": "Events",
      "slug": "events",
      "type": "news",
      "isActive": true
    }
  ]
}
```

#### `GET /categories/:id`

- Auth: kerak emas.
- Params: `id` MongoDB ObjectId.
- Success response `200`:

```json
{
  "success": true,
  "data": {
    "_id": "categoryId",
    "name": "Events",
    "slug": "events",
    "type": "news",
    "isActive": true
  }
}
```

#### `PATCH /categories/:id`

- Auth: kerak.
- Params: `id` MongoDB ObjectId.
- Request body:

```json
{
  "name": "Updated Events",
  "slug": "updated-events",
  "type": "news",
  "isActive": false
}
```

- Success response `200`:

```json
{
  "success": true,
  "data": {
    "_id": "categoryId",
    "name": "Updated Events",
    "slug": "updated-events",
    "type": "news",
    "isActive": false
  }
}
```

#### `DELETE /categories/:id`

- Auth: kerak.
- Params: `id` MongoDB ObjectId.
- Success response `200`:

```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

### 3.4. News

#### `POST /news`

- Auth: kerak.
- Request body:

```json
{
  "title": "News title",
  "slug": "news-title",
  "type": "article",
  "category": "categoryId",
  "description": "Short description",
  "content": "Full content",
  "media": [
    {
      "type": "image",
      "url": "https://example.com/image.webp",
      "size": 204800,
      "mimeType": "image/webp"
    },
    {
      "type": "video",
      "url": "https://example.com/video.mp4",
      "thumbnail": "https://example.com/video-thumb.webp",
      "size": 10485760,
      "mimeType": "video/mp4"
    }
  ]
}
```

- Success response `201`:

```json
{
  "success": true,
  "data": {
    "_id": "newsId",
    "title": "News title",
    "slug": "news-title",
    "type": "article",
    "category": "categoryId",
    "description": "Short description",
    "content": "Full content",
    "media": [
      {
        "type": "image",
        "url": "https://example.com/image.webp"
      },
      {
        "type": "video",
        "url": "https://example.com/video.mp4",
        "thumbnail": "https://example.com/video-thumb.webp"
      }
    ],
    "views": 0,
    "createdBy": "adminId"
  }
}
```

#### `GET /news`

- Auth: kerak emas.
- Query params: `category`, `type`.
- Example: `/news?category=categoryId&type=article`
- Success response `200`:

```json
{
  "success": true,
  "data": [
    {
      "_id": "newsId",
      "title": "News title",
      "slug": "news-title",
      "type": "article",
      "category": {
        "_id": "categoryId",
        "name": "Events",
        "slug": "events"
      },
      "description": "Short description",
      "content": "Full content",
      "media": [
        {
          "type": "image",
          "url": "https://example.com/image.webp"
        },
        {
          "type": "video",
          "url": "https://example.com/video.mp4",
          "thumbnail": "https://example.com/video-thumb.webp"
        }
      ],
      "views": 0,
      "createdBy": {
        "_id": "adminId",
        "fullName": "Admin Name",
        "email": "admin@example.com",
        "role": "admin"
      }
    }
  ]
}
```

#### `GET /news/:id`

- Auth: kerak emas.
- Params: `id` MongoDB ObjectId.
- Eslatma: bu route `views` qiymatini 1 taga oshiradi.
- Success response `200`:

```json
{
  "success": true,
  "data": {
    "_id": "newsId",
    "title": "News title",
    "slug": "news-title",
    "type": "article",
    "category": {
      "_id": "categoryId",
      "name": "Events"
    },
    "description": "Short description",
    "content": "Full content",
    "media": [
      {
        "type": "image",
        "url": "https://example.com/image.webp"
      },
      {
        "type": "video",
        "url": "https://example.com/video.mp4",
        "thumbnail": "https://example.com/video-thumb.webp"
      }
    ],
    "views": 1
  }
}
```

#### `PATCH /news/:id`

- Auth: kerak.
- Params: `id` MongoDB ObjectId.
- Request body:

```json
{
  "title": "Updated title",
  "slug": "updated-title",
  "type": "article",
  "category": "categoryId",
  "description": "Updated description",
  "content": "Updated content",
  "media": [
    {
      "type": "video",
      "url": "https://example.com/video.mp4",
      "thumbnail": "https://example.com/video-thumb.webp",
      "size": 10485760,
      "mimeType": "video/mp4"
    }
  ]
}
```

- Success response `200`:

```json
{
  "success": true,
  "data": {
    "_id": "newsId",
    "title": "Updated title",
    "slug": "updated-title"
  }
}
```

#### `DELETE /news/:id`

- Auth: kerak.
- Params: `id` MongoDB ObjectId.
- Success response `200`:

```json
{
  "success": true,
  "message": "News deleted successfully"
}
```

### 3.5. Team

#### `POST /team`

- Auth: kerak.
- Request body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "avatar": "https://example.com/avatar.webp",
  "role": "teacher",
  "subject": "Math",
  "international": false,
  "country": "Uzbekistan"
}
```

- Success response `201`:

```json
{
  "success": true,
  "data": {
    "_id": "teamMemberId",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "https://example.com/avatar.webp",
    "role": "teacher",
    "subject": "Math",
    "international": false,
    "country": "Uzbekistan"
  }
}
```

#### `GET /team`

- Auth: kerak emas.
- Query params: `role`, `international`.
- Example: `/team?role=teacher&international=false`
- Success response `200`:

```json
{
  "success": true,
  "data": [
    {
      "_id": "teamMemberId",
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": "https://example.com/avatar.webp",
      "role": "teacher",
      "subject": "Math",
      "international": false,
      "country": "Uzbekistan"
    }
  ]
}
```

#### `GET /team/:id`

- Auth: kerak emas.
- Params: `id` MongoDB ObjectId.
- Success response `200`:

```json
{
  "success": true,
  "data": {
    "_id": "teamMemberId",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "https://example.com/avatar.webp",
    "role": "teacher",
    "subject": "Math",
    "international": false,
    "country": "Uzbekistan"
  }
}
```

#### `PATCH /team/:id`

- Auth: kerak.
- Params: `id` MongoDB ObjectId.
- Request body:

```json
{
  "name": "Updated Name",
  "email": "updated@example.com",
  "avatar": "https://example.com/new-avatar.webp",
  "role": "international_teacher",
  "subject": "English",
  "international": true,
  "country": "United Kingdom"
}
```

- Success response `200`:

```json
{
  "success": true,
  "data": {
    "_id": "teamMemberId",
    "name": "Updated Name",
    "email": "updated@example.com",
    "role": "international_teacher",
    "international": true
  }
}
```

#### `DELETE /team/:id`

- Auth: kerak.
- Params: `id` MongoDB ObjectId.
- Success response `200`:

```json
{
  "success": true,
  "message": "Team member deleted successfully"
}
```

### 3.6. Upload

#### `POST /upload/file`

- Auth: kerak.
- Content-Type: `multipart/form-data`.
- Request field: `file`.
- Supported media: image, video, PDF.
- Success response `201`:

```json
{
  "success": true,
  "file_path": "https://example.com/image/file.webp",
  "media": {
    "type": "image",
    "url": "https://example.com/image/file.webp",
    "size": 204800,
    "mimeType": "image/webp"
  }
}
```

`media` faqat image/video upload qilinganda qaytadi va `news.media[]` uchun ishlatiladi. PDF upload qilinganda faqat `file_path` qaytadi.

#### `POST /upload/files`

- Auth: kerak.
- Content-Type: `multipart/form-data`.
- Request field: `files`.
- Limit: 10 ta file.
- Supported media: image, video, PDF.
- Success response `201`:

```json
{
  "success": true,
  "file_paths": [
    "https://example.com/image/file-1.webp",
    "https://example.com/video/file-2.mp4"
  ],
  "media_items": [
    {
      "type": "image",
      "url": "https://example.com/image/file-1.webp",
      "size": 204800,
      "mimeType": "image/webp"
    },
    {
      "type": "video",
      "url": "https://example.com/video/file-2.mp4",
      "size": 10485760,
      "mimeType": "video/mp4"
    }
  ]
}
```

### 3.7. Common error response

- Validation error `422`:

```json
{
  "success": false,
  "error": {
    "statusCode": 422,
    "statusMsg": "Unprocessable Entity",
    "msg": "Email is required."
  }
}
```

- Unauthorized `401`:

```json
{
  "success": false,
  "error": {
    "statusCode": 401,
    "statusMsg": "Unauthorized",
    "msg": "Unauthorized"
  }
}
```

- Forbidden `403`:

```json
{
  "success": false,
  "error": {
    "statusCode": 403,
    "statusMsg": "Forbidden",
    "msg": "Forbidden"
  }
}
```

- Not found `404`:

```json
{
  "success": false,
  "error": {
    "statusCode": 404,
    "statusMsg": "Not Found",
    "msg": "News not found!"
  }
}
```
