# Redux Toolkit Query qo'llanma: JavaScript uchun

Bu qo'llanma `category`, `news` va `team` uchun `GET` va `GET by id` requestlarini JavaScript/JSX loyihada Redux Toolkit Query orqali chaqirishni tushuntiradi.

Loyihada hozir TypeScript fayllar bor, lekin shu yerdagi kod namunalar JavaScript uchun yozilgan. Agar JS loyiha bo'lsa, fayl nomlari odatda `.js` va `.jsx` bo'ladi.

## 1. Redux paketlarini o'rnatish

Yarn:

```bash
yarn add @reduxjs/toolkit react-redux
```

npm:

```bash
npm install @reduxjs/toolkit react-redux
```

Kerakli paketlar:

```json
{
  "@reduxjs/toolkit": "^2.11.2",
  "react-redux": "^9.2.0"
}
```

## 2. API base yaratish

Fayl: `src/app/api/baseApi/baseApi.js`

```js
import {
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react'
import {
  clearAuthTokens,
  getAuthToken,
  getRefreshToken,
  setAuthTokens,
} from '@/lib/auth'

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  credentials: 'include',
  prepareHeaders: (headers) => {
    headers.set('Accept', 'application/json')

    const token = getAuthToken()

    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    return headers
  },
})

const baseQueryWithRefresh = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions)

  if (result.error?.status === 401) {
    const refreshToken = getRefreshToken()

    if (!refreshToken) {
      clearAuthTokens()
      return result
    }

    const refreshResult = await rawBaseQuery(
      {
        url: '/auth/refresh-token',
        method: 'POST',
        body: { refresh_token: refreshToken },
      },
      api,
      extraOptions
    )

    const refreshData = refreshResult.data

    if (refreshData?.success && refreshData.access_token) {
      setAuthTokens({
        access_token: refreshData.access_token,
        refresh_token: refreshData.refresh_token,
      })

      result = await rawBaseQuery(args, api, extraOptions)
    } else {
      clearAuthTokens()
    }
  }

  return result
}

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseQueryWithRefresh,
  tagTypes: ['admin', 'user', 'category', 'news', 'team'],
  keepUnusedDataFor: 60,
  refetchOnFocus: true,
  refetchOnReconnect: true,
  endpoints: () => ({}),
})

export default baseApi
```

`.env`:

```env
VITE_API_BASE_URL=https://api.example.com
```

Muhim joylari:

- `baseUrl` hamma endpointlar uchun asosiy API URL.
- `prepareHeaders` token bo'lsa requestga `Authorization` qo'shadi.
- `baseQueryWithRefresh` access token eskirsa refresh token orqali requestni qayta yuboradi.
- `tagTypes` cache yangilash uchun kerak.

## 3. Redux store sozlash

Fayl: `src/app/store.js`

```js
import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import baseApi from './api/baseApi/baseApi'

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
  devTools: import.meta.env.DEV,
})

setupListeners(store.dispatch)

export default store
```

Muhim joylari:

- `baseApi.reducer` API cache state ni Redux store ichida saqlaydi.
- `baseApi.middleware` request, cache, refetch va invalidation ishlarini boshqaradi.
- `setupListeners` focus yoki internet qaytganda avtomatik refetch uchun kerak.

## 4. Provider ulash

Fayl: `src/main.jsx`

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router'
import { store } from './app/store'
import router from './routes/router'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
)
```

`Provider` ulanmasa, `useGetNewsQuery`, `useGetTeamQuery` kabi hooklar ishlamaydi.

## 5. Category endpointlari

Fayl: `src/app/api/categories/categories.js`

```js
import baseApi from '@/app/api/baseApi/baseApi'

export const categoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: (params) => ({
        url: '/categories',
        params: params || undefined,
      }),
      providesTags: ['category'],
    }),

    getCategory: builder.query({
      query: (id) => `/categories/${id}`,
      providesTags: ['category'],
    }),
  }),
})

export const {
  useGetCategoriesQuery,
  useGetCategoryQuery,
} = categoriesApi
```

### Category list: GET /categories

```jsx
import { useGetCategoriesQuery } from '@/app/api/categories'

export default function CategoryList() {
  const { data, error, isLoading, refetch } = useGetCategoriesQuery({
    page: 1,
    limit: 20,
    type: 'news',
    isActive: true,
  })

  const categories = data?.data || []

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Category olishda xatolik</div>

  return (
    <div>
      <button onClick={refetch}>Qayta yuklash</button>

      {categories.map((category) => (
        <div key={category._id}>{category.name}</div>
      ))}
    </div>
  )
}
```

Query params:

```js
{
  page: 1,
  limit: 20,
  type: 'news',
  isActive: true
}
```

### Category detail: GET /categories/:id

```jsx
import { useParams } from 'react-router'
import { useGetCategoryQuery } from '@/app/api/categories'

export default function CategoryDetail() {
  const { categoryId = '' } = useParams()

  const { data, error, isLoading } = useGetCategoryQuery(categoryId, {
    skip: !categoryId,
  })

  const category = data?.data

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Category topilmadi</div>
  if (!category) return null

  return (
    <div>
      <h1>{category.name}</h1>
      <p>{category.slug}</p>
    </div>
  )
}
```

Bu yerda `skip: !categoryId` id yo'q paytda request yubormaydi.

## 6. News endpointlari

Fayl: `src/app/api/news/news.js`

```js
import baseApi from '@/app/api/baseApi/baseApi'

export const newsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNews: builder.query({
      query: (params) => ({
        url: '/news',
        params: params || undefined,
      }),
      providesTags: ['news'],
    }),

    getNewsById: builder.query({
      query: (id) => `/news/${id}`,
      providesTags: ['news'],
    }),
  }),
})

export const {
  useGetNewsQuery,
  useGetNewsByIdQuery,
} = newsApi
```

### News list: GET /news

```jsx
import { useGetNewsQuery } from '@/app/api/news'

export default function NewsList() {
  const { data, error, isLoading } = useGetNewsQuery({
    page: 1,
    limit: 20,
    category: 'categoryId',
    type: 'image',
  })

  const newsList = data?.data || []

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>News olishda xatolik</div>

  return (
    <div>
      {newsList.map((news) => (
        <article key={news._id}>
          <h2>{news.title}</h2>
          <p>{news.description}</p>
        </article>
      ))}
    </div>
  )
}
```

Query params:

```js
{
  page: 1,
  limit: 20,
  category: 'categoryId',
  type: 'image'
}
```

### News detail: GET /news/:id

```jsx
import { useParams } from 'react-router'
import { useGetNewsByIdQuery } from '@/app/api/news'

export default function NewsDetail() {
  const { newsId = '' } = useParams()

  const { data, error, isLoading } = useGetNewsByIdQuery(newsId, {
    skip: !newsId,
  })

  const news = data?.data

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>News topilmadi</div>
  if (!news) return null

  return (
    <article>
      <h1>{news.title}</h1>
      <p>{news.description}</p>
      <div>{news.content}</div>
    </article>
  )
}
```

## 7. Team endpointlari

Fayl: `src/app/api/team/team.js`

```js
import baseApi from '@/app/api/baseApi/baseApi'

export const teamApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTeam: builder.query({
      query: (params) => ({
        url: '/team',
        params: params || undefined,
      }),
      providesTags: ['team'],
    }),

    getTeamMember: builder.query({
      query: (id) => `/team/${id}`,
      providesTags: ['team'],
    }),
  }),
})

export const {
  useGetTeamQuery,
  useGetTeamMemberQuery,
} = teamApi
```

### Team list: GET /team

```jsx
import { useGetTeamQuery } from '@/app/api/team'

export default function TeamList() {
  const { data, error, isLoading } = useGetTeamQuery({
    page: 1,
    limit: 20,
    role: 'teacher',
    international: false,
  })

  const team = data?.data || []

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Team olishda xatolik</div>

  return (
    <div>
      {team.map((member) => (
        <div key={member._id}>
          <strong>{member.name}</strong>
          <span>{member.role}</span>
        </div>
      ))}
    </div>
  )
}
```

Query params:

```js
{
  page: 1,
  limit: 20,
  role: 'teacher',
  international: false
}
```

### Team detail: GET /team/:id

```jsx
import { useParams } from 'react-router'
import { useGetTeamMemberQuery } from '@/app/api/team'

export default function TeamDetail() {
  const { teamId = '' } = useParams()

  const { data, error, isLoading } = useGetTeamMemberQuery(teamId, {
    skip: !teamId,
  })

  const member = data?.data

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Team member topilmadi</div>
  if (!member) return null

  return (
    <section>
      <h1>{member.name}</h1>
      <p>{member.email}</p>
      <p>{member.role}</p>
    </section>
  )
}
```

## 8. Hooklardan keladigan asosiy qiymatlar

```js
const {
  data,
  error,
  isLoading,
  isFetching,
  isSuccess,
  isError,
  refetch,
} = useGetNewsQuery()
```

Ma'nolari:

- `data`: API response.
- `error`: xatolik bo'lsa shu yerda bo'ladi.
- `isLoading`: birinchi yuklanish.
- `isFetching`: cache bor bo'lsa ham background request ketayotgan holat.
- `isSuccess`: request muvaffaqiyatli tugagan.
- `isError`: request xato bilan tugagan.
- `refetch`: requestni qo'lda qayta yuboradi.

List response odatda shunday bo'ladi:

```js
{
  success: true,
  data: [],
  page: 1,
  limit: 20,
  totalPages: 1
}
```

Detail response:

```js
{
  success: true,
  data: {
    _id: 'id'
  }
}
```

Shuning uchun listda:

```js
const items = data?.data || []
```

Detailda:

```js
const item = data?.data
```

## 9. Cache va invalidation

GET endpointlarda:

```js
providesTags: ['news']
```

Mutation endpointlarda:

```js
invalidatesTags: ['news']
```

Ma'nosi:

- `providesTags` request cachega qaysi tag bilan yozilishini bildiradi.
- `invalidatesTags` create/update/delete dan keyin shu cache eskirganini bildiradi.
- Cache invalid bo'lsa, RTK Query kerakli requestlarni qayta yuklaydi.

Masalan, `deleteNews` ishlasa, `useGetNewsQuery()` listi avtomatik yangilanadi.

## 10. Mavjud hook nomlari

Category:

```js
useGetCategoriesQuery(params)
useGetCategoryQuery(id, options)
```

News:

```js
useGetNewsQuery(params)
useGetNewsByIdQuery(id, options)
```

Team:

```js
useGetTeamQuery(params)
useGetTeamMemberQuery(id, options)
```

Eng ko'p ishlatiladigan `options`:

```js
{
  skip: !id
}
```

Bu id bo'lmasa request ketishining oldini oladi.

## 11. Qisqa ishlatish tartibi

1. `@reduxjs/toolkit` va `react-redux` o'rnatiladi.
2. `baseApi.js` ichida `createApi` qilinadi.
3. `store.js` ichida `baseApi.reducer` va `baseApi.middleware` ulanadi.
4. `main.jsx` ichida app `Provider` bilan o'raladi.
5. Har bir modul uchun `baseApi.injectEndpoints` yoziladi.
6. Export qilingan hook komponentda chaqiriladi.
7. List uchun `data?.data || []`, detail uchun `data?.data` ishlatiladi.
