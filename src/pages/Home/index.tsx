import { useEffect, useState } from 'react'
import { Link } from 'react-router'

import { Eye } from 'lucide-react'

import type { NewsItem, TeamMember } from '@/app/api/baseApi/type'
import { useGetNewsQuery } from '@/app/api/news'
import { useGetTeamQuery } from '@/app/api/team'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import type { TeamRole } from '../Team/constants'
import {
  EmptyList,
  ErrorAlert,
  PageHeader,
  TableSkeleton,
  formatDate,
} from '../components/dashboard-ui'

const teamSections: Array<{ label: string; role: TeamRole }> = [
  { label: 'CEO', role: 'ceo' },
  { label: 'Administrations', role: 'administration' },
  { label: 'Teachers', role: 'teacher' },
  { label: 'International Teachers', role: 'international_teacher' },
  { label: 'Educators', role: 'educator' },
]

const getCategoryName = (category: NewsItem['category']) =>
  typeof category === 'string' ? category : category.name

const initials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

const getPrimaryMedia = (news: NewsItem) => news.media?.[0]

const getMediaPreviewUrl = (news: NewsItem) => {
  const media = getPrimaryMedia(news)

  if (!media) return ''

  return media.type === 'video' ? media.thumbnail || media.url : media.url
}

const getLatestNews = (newsList: NewsItem[]) =>
  [...newsList]
    .sort((first, second) => {
      const firstTime = first.created_at ? new Date(first.created_at).getTime() : 0
      const secondTime = second.created_at ? new Date(second.created_at).getTime() : 0

      return secondTime - firstTime
    })
    .slice(0, 5)

const getTeamByRole = (team: TeamMember[], role: TeamRole) =>
  team.filter((member) => member.role === role)

const DashboardIndex = () => {
  const {
    data: newsData,
    error: newsError,
    isLoading: isNewsLoading,
  } = useGetNewsQuery({ page: 1, limit: 5 })
  const {
    data: teamData,
    error: teamError,
    isLoading: isTeamLoading,
  } = useGetTeamQuery({ page: 1, limit: 100 })
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()
  const [activeSlide, setActiveSlide] = useState(0)
  const latestNews = getLatestNews(newsData?.data ?? [])
  const team = teamData?.data ?? []

  useEffect(() => {
    if (!carouselApi) return

    const updateActiveSlide = () => {
      setActiveSlide(carouselApi.selectedScrollSnap())
    }

    updateActiveSlide()
    carouselApi.on('select', updateActiveSlide)
    carouselApi.on('reInit', updateActiveSlide)

    return () => {
      carouselApi.off('select', updateActiveSlide)
      carouselApi.off('reInit', updateActiveSlide)
    }
  }, [carouselApi])

  useEffect(() => {
    if (!carouselApi || latestNews.length < 2) return

    const intervalId = window.setInterval(() => {
      carouselApi.scrollNext()
    }, 5000)

    return () => window.clearInterval(intervalId)
  }, [carouselApi, latestNews.length])

  return (
    <section className="flex flex-col gap-4">
      <PageHeader
        description="Oxirgi qo'shilgan news carousel."
        title="Home"
      />

      {isNewsLoading ? <TableSkeleton rows={5} /> : null}
      {newsError ? <ErrorAlert error={newsError} fallback="News olinmadi" /> : null}

      {!isNewsLoading && latestNews.length === 0 ? (
        <EmptyList description="Hozircha news mavjud emas." title="News yo'q" />
      ) : null}

      {latestNews.length > 0 ? (
        <Carousel
          className="mx-auto w-full max-w-5xl"
          opts={{
            align: 'start',
            loop: true,
          }}
          setApi={setCarouselApi}
        >
          <CarouselContent>
            {latestNews.map((news) => (
              <CarouselItem key={news._id}>
                <section className="relative flex min-h-[28rem] overflow-hidden rounded-lg bg-muted md:min-h-[34rem]">
                  {getMediaPreviewUrl(news) ? (
                    <img
                      alt={news.title}
                      className="absolute inset-0 size-full object-cover"
                      src={getMediaPreviewUrl(news)}
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/35 to-foreground/10" />
                  <div className="relative mt-auto flex max-w-3xl flex-col gap-5 p-6 text-background md:p-10">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary">{getCategoryName(news.category)}</Badge>
                      <Badge variant="secondary">{formatDate(news.created_at)}</Badge>
                      <Badge variant="secondary">
                        <Eye data-icon="inline-start" />
                        {news.views ?? 0}
                      </Badge>
                    </div>
                    <div className="flex flex-col gap-3">
                      <h2 className="line-clamp-2 text-3xl font-semibold tracking-normal md:text-5xl">
                        {news.title}
                      </h2>
                      <p className="line-clamp-3 text-base text-background/85 md:text-lg">
                        {news.description}
                      </p>
                    </div>
                    <div>
                      <Button asChild size="lg">
                        <Link to={`/news/${news._id}`}>View</Link>
                      </Button>
                    </div>
                  </div>
                </section>
              </CarouselItem>
            ))}
          </CarouselContent>
          {latestNews.length > 1 ? (
            <>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </>
          ) : null}
        </Carousel>
      ) : null}

      {latestNews.length > 0 ? (
        <div className="flex items-center justify-center gap-2">
          {latestNews.map((news, index) => (
            <Button
              aria-label={`${index + 1}-slidega o'tish`}
              key={news._id}
              onClick={() => carouselApi?.scrollTo(index)}
              size="icon-sm"
              type="button"
              variant={activeSlide === index ? 'default' : 'outline'}
            >
              {index + 1}
            </Button>
          ))}
        </div>
      ) : null}

      <section className="mt-6 flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold tracking-normal">Team</h2>
          <p className="text-sm text-muted-foreground">
            Role bo'yicha guruhlangan team memberlar.
          </p>
        </div>

        {isTeamLoading ? <TableSkeleton rows={6} /> : null}
        {teamError ? <ErrorAlert error={teamError} fallback="Team olinmadi" /> : null}

        {!isTeamLoading && team.length === 0 ? (
          <EmptyList description="Hozircha team member mavjud emas." title="Team yo'q" />
        ) : null}

        {teamSections.map((section) => {
          const members = getTeamByRole(team, section.role)

          if (members.length === 0) return null

          return (
            <section className="flex flex-col gap-3" key={section.role}>
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold tracking-normal">{section.label}</h3>
                <Badge variant="outline">{members.length}</Badge>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {members.map((member) => (
                  <Card key={member._id}>
                    <CardHeader className="flex flex-row items-center gap-3">
                      <Avatar className="size-12">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{initials(member.name)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <CardTitle className="truncate text-base">
                          <Link
                            className="underline-offset-4 hover:underline"
                            to={`/team/${member._id}`}
                          >
                            {member.name}
                          </Link>
                        </CardTitle>
                        <CardDescription className="truncate">
                          {member.email}
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                      {member.subject ? (
                        <Badge variant="outline">{member.subject}</Badge>
                      ) : null}
                      {member.country ? (
                        <Badge variant="outline">{member.country}</Badge>
                      ) : null}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )
        })}
      </section>
    </section>
  )
}

export default DashboardIndex
