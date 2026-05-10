'use client'

import { useState, useEffect, useMemo } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { ArrowRightLeft, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

import { Container } from './Container'
import { useGetLatestMarketPrice } from '@/hooks/Market/useGetLatestMarketPrice'

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
    const { data, isLoading, error } = useGetLatestMarketPrice()
    const pricePerGram = data?.data.pricePerGram ?? 0;

  const pricePerMg = useMemo(() => {
    if (!pricePerGram) return 0;
    return pricePerGram / 100;
  }, [pricePerGram]);

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
  const [resultRial, setResultRial] = useState<number | null>(null)

  useEffect(() => {
    if (!pricePerMg || !rawValue.trim()) {
      setResultMg(null)
      setResultRial(null)
      return
    }

    const num = Number(normalizeNumericInput(rawValue))
    if (isNaN(num) || num <= 0) {
      setResultMg(null)
      setResultRial(null)
      return
    }

    if (inputType === 'mg') {
      const rial = Math.round(num * pricePerMg)
      setResultRial(rial)
      setResultMg(num)
    } else {
      const maxMg = Math.floor(num / pricePerMg)
      const actualRial = Math.round(maxMg * pricePerMg)

      setResultMg(maxMg)
      setResultRial(actualRial)
    }
  }, [rawValue, inputType, pricePerMg])

  const minAllowedMg = mode === 'buy' ? 1 : 2
  const isValid = resultMg !== null && resultMg >= minAllowedMg

  const handleSwitchInputType = () => {
    setValue('inputType', inputType === 'rial' ? 'mg' : 'rial')
  }

  const handleValueChange = (value: string) => {
    const nextValue = inputType === 'rial' ? formatRialInput(value) : normalizeNumericInput(value)
    setValue('value', nextValue, { shouldDirty: true, shouldValidate: true })
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
    <Container className='py-12 lg:py-16 w-full'>
      <Card className="border-border/40 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <span>طلای محبی</span>
            <span className="text-sm font-doraan font-normal text-muted-foreground">
              {pricePerMg ? `${pricePerMg.toLocaleString('fa-IR')} ریال / میلی‌گرم` : '—'}
            </span>
          </CardTitle>
          <CardDescription>
            خرید و فروش طلا به صورت میلی‌گرم 
            با قیمت لحظه‌ای
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
                    {resultRial !== null ? resultRial.toLocaleString('fa-IR') : '—'} ریال
                  </span>
                  <span className="text-muted-foreground">
                    {mode === 'buy' ? 'مبلغ' : 'مبلغ واریزی'}
                  </span>
                </div>
              </div>

              {resultMg !== null && resultMg > 0 && resultMg < minAllowedMg && (
                <div className="text-center rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
                  حداقل مجاز برای {mode === 'buy' ? 'خرید' : 'فروش'}: {minAllowedMg} میلی‌گرم
                </div>
              )}

              <Button
                className="w-full"
                size="lg"
                disabled={!isValid || isLoading}
                variant={'default'}
              >
                {mode === 'buy' ? 'پرداخت و خرید' : 'تایید و فروش'}
              </Button>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </Container>
  )
}