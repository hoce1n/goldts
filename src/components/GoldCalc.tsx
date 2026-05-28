'use client'

import { useState, useEffect, useMemo } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { ArrowRightLeft, Loader, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

import { Container } from './Container'
import { useGetLatestMarketPrice } from '@/hooks/Market/useGetLatestMarketPrice'
import { useCreateQuote } from '@/hooks/Quote/useCreateQuote'
import { useDebounce } from '@/hooks/useDebounce'
import { ProductType, QuoteSide } from '@/types/quote.types'
import { useConfirmQuote } from '@/hooks/Quote/useConfirmQuote'
import { Sheet, SheetContent } from './ui/sheet'

const formSchema = z.object({
  mode: z.enum(['buy', 'sell']),
  inputType: z.enum(['rial', 'mg']),
  value: z.string().min(1, 'مقدار را وارد کنید'),
})

type FormValues = z.infer<typeof formSchema>

const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹'
const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩'

function normalizeNumericInput(value: string) {
  const normalizedDigits = value
    .replace(/[۰-۹]/g, (d) => String(PERSIAN_DIGITS.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String(ARABIC_DIGITS.indexOf(d)))
    .replace(/٬|،/g, ',')

  return normalizedDigits.replace(/[^0-9.]/g, '')
}

function formatRialInput(value: string) {
  const normalized = normalizeNumericInput(value)
  if (!normalized) return ''

  const integerPart = normalized.split('.')[0]
  if (!integerPart) return ''

  return Number(integerPart).toLocaleString('fa-IR')
}

export default function MilliCalculator() {
  const {
    mutateAsync: confirmQuote,
    isPending: isConfirming,
  } = useConfirmQuote();

  const { data, isLoading } = useGetLatestMarketPrice()
  const pricePerGram = data?.data.pricePerGram ?? 0

  const pricePerMg = useMemo(() => {
    if (!pricePerGram) return 0
    return pricePerGram / 1000;
  }, [pricePerGram])

  const {
    mutateAsync: createQuote,
    data: quote,
    isPending,
    error: quoteError,
  } = useCreateQuote()  

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mode: 'buy',
      inputType: 'rial',
      value: '',
    },
  })

  const mode = watch('mode')
  const inputType = watch('inputType')
  const rawValue = watch('value')
  const valueField = register('value')

  const [resultMg, setResultMg] = useState<number | null>(null)

  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  const debouncedMg = useDebounce(resultMg, 400)

  const amountInGrams =
    debouncedMg && debouncedMg > 0
      ? debouncedMg / 1000
      : null
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null)

  // مقدار قابل ارسال به بک‌اند.
  useEffect(() => {
    if (!pricePerMg || !rawValue.trim()) {
      setResultMg(null)
      return
    }

    const num = Number(normalizeNumericInput(rawValue))
    if (isNaN(num) || num <= 0) {
      setResultMg(null)
      return
    }

    if (inputType === 'mg') {
      setResultMg(num)
    } else {
      const mg = Math.floor(num / pricePerMg)
      setResultMg(mg > 0 ? mg : null)
    }
  }, [rawValue, inputType, pricePerMg])

  useEffect(() => {
    if (!amountInGrams) return

    createQuote({
      productType: ProductType.MeltedGold,
      amount: amountInGrams,
      side: mode === 'buy' ? QuoteSide.Buy : QuoteSide.Sell,
    })
  }, [amountInGrams, mode, createQuote])

  // تایمر اعتبار quote
  useEffect(() => {
    if (!quote?.data.expiresAtUtc) {
      setSecondsLeft(null)
      return
    }

    const expiry = new Date(quote.data.expiresAtUtc).getTime()

    const update = () => {
      const diff = Math.floor((expiry - Date.now()) / 1000)
      setSecondsLeft(diff > 0 ? diff : 0)
    }

    update()
    const interval = setInterval(update, 1000)

    return () => clearInterval(interval)
  }, [quote])

  const resultRial = quote?.data.totalPrice ?? null
  const unitPrice = quote?.data.unitPrice
    ? quote.data.unitPrice / 1000
    : null

  const minAllowedMg = mode === 'buy' ? 1 : 2
  const isValid = resultMg !== null && resultMg >= minAllowedMg

  const handleConfirm = async () => {
    if (!quote?.data.id) return;
    
    try {
      const response = await confirmQuote(quote.data.id);
      setIsPreviewOpen(false);
      setSecondsLeft(null);
    } catch (err: any) {
      console.error(err)
    }
  }

  const handleSwitchInputType = () => {
    setValue('inputType', inputType === 'rial' ? 'mg' : 'rial')
    setValue('value', '')
    setResultMg(null)
    setSecondsLeft(null)
  }

  const handleValueChange = (value: string) => {
    const nextValue =
      inputType === 'rial' ? formatRialInput(value) : normalizeNumericInput(value)

    setValue('value', nextValue, {
      shouldDirty: true,
      shouldValidate: true,
    })
  }

  const handleValueBlur = (value: string) => {
    if (inputType !== 'rial' || !pricePerMg) return

    const normalized = normalizeNumericInput(value)
    const num = Number(normalized)
    if (!normalized || isNaN(num) || num <= 0) return

    const snappedMg = Math.floor(num / pricePerMg)
    const snappedRial = Math.round(snappedMg * pricePerMg)

    if (snappedRial > 0 && num !== snappedRial) {
      setValue('value', formatRialInput(String(snappedRial)), {
        shouldDirty: true,
        shouldValidate: true,
      })
    }
  }

  if (isLoading && !pricePerMg) {
    return (
      <div className="flex min-h-75 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <section id='GoldCalc'>
    <Container className="py-12 lg:py-16 w-full">
      <Card className="border-border/40 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <span>طلای محبی</span>
            <span className="text-sm font-doraan font-normal text-muted-foreground">
              {pricePerMg ? `${pricePerMg.toLocaleString('fa-IR')} ریال / میلی‌گرم` : '—'}
            </span>
          </CardTitle>

          <CardDescription>
            خرید و فروش طلا به صورت میلی‌گرم با قیمت لحظه‌ای
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <Tabs value={mode} onValueChange={(v) => setValue('mode', v as 'buy' | 'sell')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="buy">خرید</TabsTrigger>
              <TabsTrigger value="sell">فروش</TabsTrigger>
            </TabsList>

            <div className="mt-6 space-y-5">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="value" className="flex items-center justify-between">
                  <span>
                    {inputType === 'rial'
                      ? mode === 'buy'
                        ? 'مبلغ پرداختی (ریال)'
                        : 'مبلغ دریافتی مورد نظر (ریال)'
                      : 'مقدار طلا (میلی‌گرم)'}
                  </span>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={handleSwitchInputType}
                  >
                    <ArrowRightLeft className="mr-1.5 h-3.5 w-3.5" />
                    تغییر واحد
                  </Button>
                </Label>

                <Input
                  id="value"
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  name={valueField.name}
                  ref={valueField.ref}
                  onBlur={(e) => {
                    valueField.onBlur(e)
                    handleValueBlur(e.target.value)
                  }}
                  value={rawValue}
                  onChange={(e) => handleValueChange(e.target.value)}
                  placeholder={inputType === 'rial' ? 'مثال: ۵۰۰۰۰۰' : 'مثال: ۱۰'}
                  className={cn(
                    'text-lg text-center font-doraan font-medium',
                    errors.value && 'border-destructive focus-visible:ring-destructive'
                  )}
                />

                {errors.value && (
                  <p className="text-xs text-destructive">{errors.value.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 rounded-lg border bg-muted/40 p-4">
                <div className="flex justify-between text-sm">
                  <span className="font-medium font-doraan">
                    {resultMg !== null ? resultMg.toLocaleString('fa-IR') : '—'} میلی‌گرم
                  </span>
                  <span className="text-muted-foreground">
                    {mode === 'buy' ? 'طلا دریافتی' : 'طلا واگذار شده'}
                  </span>
                </div>

                <div className="flex justify-between border-t pt-3 text-sm">
                  <span className="font-medium font-doraan">
                    {isPending
                      ? <Loader className='animate-spin' />
                      : resultRial !== null
                        ? `${resultRial.toLocaleString('fa-IR')} ریال`
                        : '—'}
                  </span>
                  <span className="text-muted-foreground">
                    {mode === 'buy' ? 'مبلغ نهایی' : 'مبلغ دریافتی'}
                  </span>
                </div>

                <div className="flex justify-between border-t pt-3 text-sm">
                  <span className="font-medium font-doraan">
                    {unitPrice !== null ? `${unitPrice.toLocaleString('fa-IR')} ریال` : '—'}
                  </span>
                  <span className="text-muted-foreground">
                   قیمت هر میلی‌گرم
                  </span>
                </div>
              </div>

              {secondsLeft !== null && resultRial !== null && (
                <div className="text-center rounded-md bg-primary/5 px-3 py-2 text-xs text-muted-foreground">
                  اعتبار این قیمت: {secondsLeft} ثانیه
                </div>
              )}

              {quoteError && (
                <div className="text-center rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
                  دریافت قیمت با خطا مواجه شد. دوباره تلاش کنید.
                </div>
              )}

              {resultMg !== null && resultMg > 0 && resultMg < minAllowedMg && (
                <div className="text-center rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
                  حداقل مجاز برای {mode === 'buy' ? 'خرید' : 'فروش'}: {minAllowedMg} میلی‌گرم
                </div>
              )}

              <Button
                className="w-full"
                size="lg"
                disabled={
                  !isValid || 
                  isPending || 
                  !quote?.data?.id || 
                  secondsLeft === 0}
                variant="default"
                onClick={() => setIsPreviewOpen(true)}
              >
                {isPending && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                {mode === 'buy' 
                ? 'پرداخت و خرید' 
                : 'تایید و فروش'}
              </Button>
            </div>
          </Tabs>
        </CardContent>
      </Card>
      <Sheet open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <SheetContent
          side='right'
          className="border-0 px-6 py-8"
        >
          <div className="mx-auto mb-6 h-1.5 w-14 rounded-full bg-muted" />

          <div className="space-y-6">

            <div className="text-center">
              <h3 className="text-xl font-bold">
                {mode === 'buy'
                  ? 'تایید خرید میلی'
                  : 'تایید فروش میلی'}
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                قیمت تا {secondsLeft} ثانیه معتبر است
              </p>
            </div>

            <div className="rounded-2xl bg-muted/40 p-5 text-center">
              <div className="text-sm text-muted-foreground">
                مقدار طلا
              </div>

              <div className="mt-2 text-3xl font-extrabold tracking-tight">
                {resultMg?.toLocaleString('fa-IR')}
              </div>

              <div className="mt-1 text-sm text-muted-foreground">
                میلی‌گرم
              </div>
            </div>

            <div className="space-y-3 rounded-2xl border p-4">

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  قیمت هر میلی‌گرم
                </span>

                <span className="font-medium">
                  {unitPrice?.toLocaleString('fa-IR')} ریال
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  کارمزد
                </span>

                <span className="font-medium">
                  ۰ ریال
                </span>
              </div>

              <div className="h-px bg-border" />

              <div className="flex items-center justify-between">
                <span className="font-medium">
                  مبلغ نهایی
                </span>

                <span className="text-lg font-bold">
                  {resultRial?.toLocaleString('fa-IR')} ریال
                </span>
              </div>
            </div>

            <Button
              size="lg"
              className="h-12 w-full rounded-2xl text-base font-bold"
              disabled={secondsLeft === 0 || isConfirming}
              onClick={handleConfirm}
            >
              {isConfirming && (
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              )}

              {secondsLeft === 0
                ? 'قیمت منقضی شده'
                : mode === 'buy'
                  ? 'تایید و خرید'
                  : 'تایید و فروش'}
            </Button>

          </div>
        </SheetContent>
      </Sheet>

    </Container>
    </section>
  )
}
