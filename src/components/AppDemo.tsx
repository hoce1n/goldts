'use client'

import { useId, useMemo, useRef, useState } from 'react'
import clsx from 'clsx'
import { motion, useInView, useMotionValue } from 'framer-motion'

import { AppScreen } from '@/components/AppScreen'
import { useGetMarketPriceHistory } from '@/hooks/Market/useGetMarketPriceHistory'
import { Loader } from 'lucide-react'
import { Skeleton } from './ui/skeleton'
import { Button } from './ui/button'

interface ChartProps extends React.ComponentPropsWithoutRef<'svg'> {
  prices: number[]
  minPrice: number
  maxPrice: number
  activePointIndex: number | null
  onChangeActivePointIndex: (index: number | null) => void
  width: number
  height: number
  paddingX?: number
  paddingY?: number
  gridLines?: number
}

function Chart({
  prices,
  minPrice,
  maxPrice,
  activePointIndex,
  onChangeActivePointIndex,
  width: totalWidth,
  height: totalHeight,
  paddingX = 0,
  paddingY = 0,
  gridLines = 6,
  className,
  ...props
}: ChartProps) {
  let width = totalWidth - paddingX * 2
  let height = totalHeight - paddingY * 2

  let id = useId()
  let svgRef = useRef<SVGSVGElement>(null)
  let pathRef = useRef<SVGPathElement>(null)
  let isInView = useInView(svgRef, { amount: 0.5, once: true })
  let pathWidth = useMotionValue(0)
  let [interactionEnabled, setInteractionEnabled] = useState(false)

  let { path, points } = useMemo(() => {
    let path = ''
    let points: Array<{ x: number; y: number }> = []

    if (prices.length === 0) return { path, points }

    for (let index = 0; index < prices.length; index++) {
      // جلوگیری از تقسیم بر صفر اگر فقط یک نقطه وجود داشت
      const xRatio = prices.length > 1 ? index / (prices.length - 1) : 0.5
      let x = paddingX + xRatio * width
      
      // جلوگیری از تقسیم بر صفر اگر min و max برابر بودند
      const priceRange = maxPrice - minPrice
      const yRatio = priceRange !== 0 ? (prices[index] - minPrice) / priceRange : 0.5
      let y = paddingY + (1 - yRatio) * height
      
      points.push({ x, y })
      path += `${index === 0 ? 'M' : 'L'} ${x.toFixed(4)} ${y.toFixed(4)}`
    }
    return { path, points }
  }, [prices, minPrice, maxPrice, width, height, paddingX, paddingY])

  if (prices.length === 0) return null

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${totalWidth} ${totalHeight}`}
      className={clsx(className, 'overflow-visible')}
      {...(interactionEnabled
        ? {
            onPointerLeave: () => onChangeActivePointIndex(null),
            onPointerMove: (event) => {
              let rect = svgRef.current?.getBoundingClientRect()
              if (!rect) return
              let x = event.clientX - rect.left

              let closestPointIndex: number | null = null
              let closestDistance = Infinity
              for (
                let i = 0;
                i < points.length;
                i++
              ) {
                let point = points[i]
                let distance = Math.abs(point.x - x)
                if (distance < closestDistance) {
                  closestDistance = distance
                  closestPointIndex = i
                } else {
                  break
                }
              }
              onChangeActivePointIndex(closestPointIndex)
            },
          }
        : {})}
      {...props}
    >
      <defs>
        <clipPath id={`${id}-clip`}>
          <path d={`${path} V ${height + paddingY} H ${paddingX} Z`} />
        </clipPath>
        <linearGradient id={`${id}-gradient`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.795 0.184 86.047)" />
          <stop offset="100%" stopColor="oklch(0.795 0.184 86.047)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[...Array(gridLines - 1).keys()].map((index) => (
        <line
          key={index}
          stroke="oklch(0.795 0.184 86.047)"
          opacity="0.1"
          x1="0"
          y1={(totalHeight / gridLines) * (index + 1)}
          x2={totalWidth}
          y2={(totalHeight / gridLines) * (index + 1)}
        />
      ))}
      <motion.rect
        y={paddingY}
        width={pathWidth}
        height={height}
        fill={`url(#${id}-gradient)`}
        clipPath={`url(#${id}-clip)`}
        opacity="0.5"
      />
      <motion.path
        ref={pathRef}
        d={path}
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        transition={{ duration: 1 }}
        {...(isInView ? { stroke: 'oklch(0.795 0.184 86.047)', animate: { pathLength: 1 } } : {})}
        onUpdate={({ pathLength }) => {
          if (pathRef.current && typeof pathLength === 'number') {
            pathWidth.set(
              pathRef.current.getPointAtLength(
                pathLength * pathRef.current.getTotalLength(),
              ).x,
            )
          }
        }}
        onAnimationComplete={() => setInteractionEnabled(true)}
      />
      {activePointIndex !== null && points[activePointIndex] && (
        <>
          <line
            x1="0"
            y1={points[activePointIndex].y}
            x2={totalWidth}
            y2={points[activePointIndex].y}
            stroke="oklch(0.795 0.184 86.047)"
            strokeDasharray="1 3"
          />
          <circle
            r="4"
            cx={points[activePointIndex].x}
            cy={points[activePointIndex].y}
            fill="#fff"
            strokeWidth="2"
            stroke="oklch(0.795 0.184 86.047)"
          />
        </>
      )}
    </svg>
  )
}

export function AppDemo() {
  const [range, setRange] = useState<"Day" | "Week" | "Month">("Day");
  const { data, isLoading, error } = useGetMarketPriceHistory(range);

  const pointsData = data?.data.points ?? [];
  
  const prices = useMemo(() => pointsData.map(p => p.price), [pointsData]);

  const maxPrice = useMemo(() => Math.max(...prices), [prices]);
  const minPrice = useMemo(() => Math.min(...prices), [prices]);

  const [activePointIndex, setActivePointIndex] = useState<number | null>(null);

  const activeIndex =
    activePointIndex !== null
      ? activePointIndex
      : prices.length
      ? prices.length - 1
      : 0

  const activeValue = prices[activeIndex] || 0;
  const previousValue = prices[activeIndex - 1] || activeValue;

  const percentageChange =
    activeIndex === 0 || !previousValue
      ? null
      : ((activeValue - previousValue) / previousValue) * 100;

  return (
    <AppScreen>
      <AppScreen.Body>
        <div className="p-4">
          <div className="flex gap-2">
            <div className="text-xs/6.5 text-gray-500">فروشگاه آنلاین</div>
            <div className="text-sm text-gray-900">طلای محبی</div>
            <svg viewBox="0 0 24 24" className="mr-auto h-6 w-6" fill="none">
              <path
                d="M5 12a7 7 0 1 1 14 0 7 7 0 0 1-14 0ZM12 9v6M15 12H9"
                stroke="#171717"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="mt-3 border-t border-gray-200 pt-5">
            <span className='font-doraan text-sm'>قیمت 1 گرم طلای 18 عیار:</span>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl tracking-tight text-gray-900 tabular-nums">
                {isLoading ? <Skeleton className='w-18 h-4 bg-gray-200' /> : activeValue.toLocaleString("fa-IR")}
              </div>
              <div className="text-sm text-gray-900">تومان</div>
              {percentageChange && (
                <div
                  className={clsx(
                    'ml-auto text-sm tracking-tight tabular-nums',
                    percentageChange >= 0 ? 'text-primary' : 'text-muted',
                  )}
                >
                  {`${
                    percentageChange >= 0 ? '+' : ''
                  }${percentageChange.toFixed(2)}%`}
                </div>
              )}
            </div>
            <div className="mt-6 flex gap-4 text-xs text-gray-500 px-2">
              <button
                className={clsx(range === "Day" && "font-semibold text-primary-foreground")}
                onClick={() => setRange("Day")}
              >
                یک روز
              </button>
              <button
                className={clsx(range === "Week" && "font-semibold text-primary-foreground")}
                onClick={() => setRange("Week")}
              >
                یک هفته
              </button>
              <button
                className={clsx(range === "Month" && "font-semibold text-primary-foreground")}
                onClick={() => setRange("Month")}
              >
                یک ماه
              </button>
            </div>
            <div className="mt-3 rounded-lg bg-gray-50 ring-1 ring-black/5 ring-inset">
            {isLoading ? 
              <div className='relative flex items-center justify-center h-30'>
                <Skeleton className='bg-gray-200 absolute inset-0' />
                <Loader className='animate-spin' />
              </div>
            : error ? 
              <div className='flex flex-col items-center justify-center h-30'>
                .fail to fetch
              </div> 
            : !prices.length ? "" : (
              <Chart
                width={286}
                height={130} //208
                paddingX={16}
                paddingY={32}
                prices={prices}
                minPrice={minPrice}
                maxPrice={maxPrice}
                activePointIndex={activePointIndex}
                onChangeActivePointIndex={setActivePointIndex}
              />
            )}
            </div>
            <Button
              className='w-full mt-4'
            >
              خرید و فروش
            </Button>
            <div className="mt-3 divide-y divide-gray-100 text-sm">
              <div className="flex justify-between py-1">
                <div className="text-gray-500">Open</div>
                <div className="font-medium text-gray-900">{prices}</div>
              </div>
              <div className="flex justify-between py-1">
                <div className="text-gray-500">بیشترین قیمت:</div>
                <div className="font-medium text-gray-900">{maxPrice.toLocaleString()}</div>
              </div>
              <div className="flex justify-between py-1">
                <div className="text-gray-500">کمترین قیمت</div>
                <div className="font-medium text-gray-900">{minPrice.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
      </AppScreen.Body>
    </AppScreen>
  )
}
