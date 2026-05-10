import { AppStoreLink } from '@/components/AppStoreLink'
import { CircleBackground } from '@/components/CircleBackground'
import { Container } from '@/components/Container'
import { Button } from './ui/button'
import { ArrowLeft } from 'lucide-react'

export function CallToAction() {
  return (
    <section
      id="get-free-shares-today"
      className="relative overflow-hidden bg-gray-900 py-20 sm:py-28"
    >
      <div className="absolute top-1/2 left-20 -translate-y-1/2 sm:left-1/2 sm:-translate-x-1/2">
        <CircleBackground color="oklch(0.795 0.184 86.047)" className="animate-spin-slower" />
      </div>
      <Container className="relative">
        <div className="mx-auto max-w-md sm:text-center">
          <h2 className="text-3xl font-medium tracking-tight text-white sm:text-4xl">
            همین امروز سرمایه گذاری را شروع کنید.
          </h2>
          <p className="mt-4 text-lg text-gray-300">
          ثبت‌نام فقط ۳۰ ثانیه زمان می‌برد. اپلیکیشن را دانلود کنید، حساب خود را بسازید و با خیال راحت طلا بخرید.
          </p>
          <div className="mt-8 flex justify-center">
            {/* <AppStoreLink color="white" /> */}
            <Button
                variant="outline"
                className=''
              >
                <span className="ml-2.5">خرید طلای آبشده</span>
                <ArrowLeft className="h-6 w-6 flex-none" />
              </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}
