import { useEffect, useState } from 'react'
import { Link } from 'react-router'

import { Eye, LayoutGrid, List, Pencil, Plus, } from 'lucide-react'
import { toast } from 'sonner'

import type {
  NewsItem,
} from '@/app/api/baseApi/type'
import { getApiErrorMessage } from '@/app/api/baseApi'
import { useGetCategoriesQuery } from '@/app/api/categories'
import {
  useDeleteNewsMutation,
  useGetNewsQuery,
} from '@/app/api/news'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { mediaTypeOptions } from './constants'
import NewsMediaPreview from './components/NewsMediaPreview'
import {
  DeleteAction,
  EmptyList,
  ErrorAlert,
  FilterSelect,
  PageHeader,
  PaginationControls,
  TableSkeleton,
} from '../components/dashboard-ui'

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 20


const getCategoryName = (category: NewsItem['category']) =>
  typeof category === 'string' ? category : category.name

const getAuthorName = (createdBy: NewsItem['createdBy']) => {
  if (!createdBy) return '-'
  return typeof createdBy === 'string' ? createdBy : createdBy.fullName
}

const getMediaSummary = (media: NewsItem['media']) => {
  if (!media?.length) return '-'
  const imageCount = media.filter((item) => item.type === 'image').length
  const videoCount = media.filter((item) => item.type === 'video').length

  if (imageCount && videoCount) return `${imageCount} image, ${videoCount} video`

  return `${media.length} ${media[0].type}`
}



const NewsPage = () => {
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [mediaTypeFilter, setMediaTypeFilter] = useState('all')
  const [page, setPage] = useState(DEFAULT_PAGE)
  const { data: categoriesData } = useGetCategoriesQuery({
    type: 'news',
    page: DEFAULT_PAGE,
    limit: 100,
  })
  const categories = categoriesData?.data ?? []
  const filters = {
    page,
    limit: DEFAULT_LIMIT,
    ...(categoryFilter !== 'all' ? { category: categoryFilter } : {}),
    ...(mediaTypeFilter !== 'all' ? { type: mediaTypeFilter } : {}),
  }
  const { data, error, isLoading } = useGetNewsQuery(filters)
  const [deleteNews, deleteState] = useDeleteNewsMutation()
  const newsList = data?.data ?? []

  useEffect(() => {
    setPage(DEFAULT_PAGE)
  }, [categoryFilter, mediaTypeFilter])

  const handleDelete = async (id: string) => {
    try {
      await deleteNews(id).unwrap()
      toast.success('News oʼchirildi')
    } catch (deleteError) {
      toast.error(getApiErrorMessage(deleteError, 'News oʼchirilmadi'))
    }
  }

  return (
    <section className="flex flex-col gap-4">
      <PageHeader
        action={
          <Button asChild>
            <Link to="create">
              <Plus data-icon="inline-start" />
              News
            </Link>
          </Button>
        }
        description="News CRUD, filterlar, media schema va upload flow."
        title="News"
      />

      <div className="flex flex-col gap-2 md:flex-row">
        <FilterSelect
          label="Category"
          onValueChange={setCategoryFilter}
          options={[
            { label: 'All categories', value: 'all' },
            ...categories.map((category) => ({
              label: category.name,
              value: category._id,
            })),
          ]}
          value={categoryFilter}
        />
        <FilterSelect
          label="Media type"
          onValueChange={setMediaTypeFilter}
          options={[{ label: 'All media', value: 'all' }, ...mediaTypeOptions]}
          value={mediaTypeFilter}
        />
      </div>

      {error ? <ErrorAlert error={error} fallback="News olinmadi" /> : null}

      <Tabs defaultValue="table">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm text-muted-foreground">
            {newsList.length} ta news
          </div>
          <TabsList>
            <TabsTrigger value="table">
              <List data-icon="inline-start" />
              Table
            </TabsTrigger>
            <TabsTrigger value="cards">
              <LayoutGrid data-icon="inline-start" />
              Cards
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="table">
          <Card>
            <CardHeader>
              <CardTitle>News</CardTitle>
              <CardDescription>Media preview va asosiy ma'lumotlar.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? <TableSkeleton /> : null}
              {!isLoading && newsList.length === 0 ? (
                <EmptyList description="Filter bo'yicha news topilmadi." title="News yo'q" />
              ) : null}
              {newsList.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Media</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Media type</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead>Created by</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {newsList.map((news) => (
                      <TableRow key={news._id}>
                        <TableCell>
                          <NewsMediaPreview news={news} size="sm" />
                        </TableCell>
                        <TableCell className="max-w-72">
                          <Link
                            className="block truncate font-medium underline-offset-4 hover:underline"
                            to={news._id}
                          >
                            {news.title}
                          </Link>
                          <p className="line-clamp-2 text-sm text-muted-foreground">
                            {news.description}
                          </p>
                        </TableCell>
                        <TableCell>{getCategoryName(news.category)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{getMediaSummary(news.media)}</Badge>
                        </TableCell>
                        <TableCell>{news.views ?? 0}</TableCell>
                        <TableCell>{getAuthorName(news.createdBy)}</TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button asChild size="sm" variant="outline">
                              <Link to={news._id}>
                                <Eye data-icon="inline-start" />
                                View
                              </Link>
                            </Button>
                            <Button asChild size="sm" variant="outline">
                              <Link to={`${news._id}/edit`}>
                                <Pencil data-icon="inline-start" />
                                Edit
                              </Link>
                            </Button>
                            <DeleteAction
                              description={`${news.title} news o'chiriladi.`}
                              disabled={deleteState.isLoading}
                              label="News o'chirish"
                              onConfirm={() => void handleDelete(news._id)}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : null}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cards">
          {isLoading ? <TableSkeleton /> : null}
          {!isLoading && newsList.length === 0 ? (
            <EmptyList description="Filter bo'yicha news topilmadi." title="News yo'q" />
          ) : null}
          {newsList.length > 0 ? (
            <div className="grid auto-rows-fr gap-4 md:grid-cols-2 xl:grid-cols-3">
              {newsList.map((news) => (
                <Card className="flex h-full overflow-hidden" key={news._id}>
                  <NewsMediaPreview news={news} />
                  <CardHeader className="shrink-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline">{getMediaSummary(news.media)}</Badge>
                      <Badge variant="outline">
                        <Eye data-icon="inline-start" />
                        {news.views ?? 0}
                      </Badge>
                    </div>
                    <CardTitle className="line-clamp-2 min-h-13 text-xl leading-7">
                      <Link className="underline-offset-4 hover:underline" to={news._id}>
                        {news.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="truncate">
                      {getCategoryName(news.category)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col gap-3">
                    <p className="line-clamp-3 min-h-18 text-muted-foreground">
                      {news.description}
                    </p>
                    <div className="mt-auto flex items-center justify-between gap-3 text-sm">
                      <span className="text-muted-foreground">Created by</span>
                      <span className="truncate font-medium">
                        {getAuthorName(news.createdBy)}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="mt-auto justify-between gap-2 border-t bg-muted/40">
                    <Button asChild size="sm" variant="outline">
                      <Link to={news._id}>
                        <Eye data-icon="inline-start" />
                        View
                      </Link>
                    </Button>
                    <div className="flex gap-2">
                      <Button asChild size="sm" variant="outline">
                        <Link to={`${news._id}/edit`}>
                          <Pencil data-icon="inline-start" />
                          Edit
                        </Link>
                      </Button>
                      <DeleteAction
                        description={`${news.title} news o'chiriladi.`}
                        disabled={deleteState.isLoading}
                        label="News o'chirish"
                        onConfirm={() => void handleDelete(news._id)}
                      />
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : null}
        </TabsContent>
      </Tabs>
      {data ? (
        <PaginationControls
          next={data.next}
          onPageChange={setPage}
          page={data.page}
          prev={data.prev}
          totalPages={data.totalPages}
        />
      ) : null}
    </section>
  )
}

export default NewsPage
