import { Link, useLocation, useNavigate } from 'react-router'

import { ArrowLeft, Home, SearchX } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

const NotFoundPage = () => {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <section className="flex min-h-[calc(100svh-8rem)] items-center justify-center">
      <Empty className="mx-auto max-w-xl border bg-card">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <SearchX />
          </EmptyMedia>
          <Badge variant="outline">404</Badge>
          <EmptyTitle className="text-xl">Sahifa topilmadi</EmptyTitle>
          <EmptyDescription>
            Bu manzil mavjud emas yoki boshqa joyga ko'chirilgan.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="w-full rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
            {location.pathname}
          </div>
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
            <Button onClick={() => navigate(-1)} type="button" variant="outline">
              <ArrowLeft data-icon="inline-start" />
              Ortga qaytish
            </Button>
            <Button asChild>
              <Link to="/">
                <Home data-icon="inline-start" />
                Bosh sahifa
              </Link>
            </Button>
          </div>
        </EmptyContent>
      </Empty>
    </section>
  )
}

export default NotFoundPage
