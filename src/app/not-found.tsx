import { Button } from '@/components/ui/button'
import { CirclesBackground } from '@/components/CirclesBackground'
import { Container } from '@/components/Container'
import { Layout } from '@/components/Layout'
import { GhostIcon } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <Layout>
      <Container className="relative isolate flex h-full flex-col items-center justify-center py-20 text-center sm:py-32">
        <CirclesBackground className="absolute top-1/2 left-1/2 -z-10 mt-44 w-[68.125rem] -translate-x-1/2 -translate-y-1/2 stroke-gray-300/30 [mask-image:linear-gradient(to_bottom,white_20%,transparent_75%)]" />
        <p className="text-sm font-semibold font-mono tracking-widest">404</p>
        <h1 className="mt-2 text-3xl font-medium tracking-tight font-peydaa">
          <GhostIcon className="w-10 h-10 inline-block" />
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          ما نتونستیم صحفه ایی که دنبالش هستی رو پیدا کنیم.
        </p>
        <Button variant="outline" className="relative mt-8">
          <Link
            href={'/'}
            className='absolute inset-0'
          >
          </Link>
          برگشت به خانه
        </Button>
      </Container>
    </Layout>
  )
}
