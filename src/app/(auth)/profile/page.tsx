'use client'

import { Button } from '@/components/ui/button'
import { Container } from '@/components/Container'
import { useMe } from '@/hooks/Auth/useMe'
import { useAuthStore } from '@/stores/auth.store'
import { gregorianToJalali } from '@/utils/dateUtils'
import { Loader2 } from 'lucide-react'

export default function Profile() {
  useMe()
  const { user, hydrated } = useAuthStore();
  

  const getVerificationLevelLabel = (level: number | undefined) => {
    if (level === undefined) return ''
    const levels: Record<number, string> = {
      0: 'تایید نشده',
      1: 'سطح یک',
      2: 'سطح دو',
      3: 'سطح سه',
    }
    return levels[level] || `سطح ${level}`
  }

  if (!hydrated) {
    return (
      <Container>
        <div className="my-6 text-center font-doraan text-lg">
          <p className="mt-auto">
            <Loader2 className='animate-spin mx-auto' />
          </p>
        </div>
      </Container>
    )
  }

  if (!user) {
    return (
      <Container>
        <div className="my-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">کاربر یافت نشد.</p>
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <form className="my-6">
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12 dark:border-white/10">
            <h2 className="text-base/7 font-semibold text-gray-900 dark:text-white">
              پروفایل
            </h2>
            <p className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400">
              اطلاعات حساب کاربری شما
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="first-name"
                  className="block text-sm/6 font-medium text-gray-900 dark:text-white"
                >
                  نام
                </label>
                <div className="mt-2">
                  <input
                    value={user?.firstName || ''}
                    disabled
                    id="first-name"
                    name="first-name"
                    type="text"
                    autoComplete="given-name"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="last-name"
                  className="block text-sm/6 font-medium text-gray-900 dark:text-white"
                >
                  نام خانوادگی
                </label>
                <div className="mt-2">
                  <input
                    value={user?.lastName || ''}
                    disabled
                    id="last-name"
                    name="last-name"
                    type="text"
                    autoComplete="family-name"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="national-code"
                  className="block text-sm/6 font-medium text-gray-900 dark:text-white"
                >
                  کد ملی
                </label>
                <div className="mt-2">
                  <input
                    value={user?.nationalCode || ''}
                    disabled
                    id="national-code"
                    name="national-code"
                    type="text"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="phone-number"
                  className="block text-sm/6 font-medium text-gray-900 dark:text-white"
                >
                  شماره تلفن
                </label>
                <div className="mt-2">
                  <input
                    value={user.phoneNumber || ''}
                    disabled
                    id="phone-number"
                    name="phone-number"
                    autoComplete="tel"
                    type="tel"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="email"
                  className="block text-sm/6 font-medium text-gray-900 dark:text-white"
                >
                  ایمیل
                </label>
                <div className="mt-2">
                  <input
                    value={user.email || ''}
                    disabled
                    id="email"
                    name="email"
                    autoComplete="email"
                    type="email"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="birth-date"
                  className="block text-sm/6 font-medium text-gray-900 dark:text-white"
                >
                  تاریخ تولد
                </label>
                <div className="mt-2">
                  <input
                    value={gregorianToJalali(user.birthdate)}
                    disabled
                    type="text"
                    id="birth-date"
                    name="birth-date"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="verification-level">سطح تایید</label>
                <div className="mt-2">
                  <input
                    value={getVerificationLevelLabel(user.verificationLevel)}
                    disabled
                    id="verification-level"
                    name="verification-level"
                    type="text"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="profile-status"
                  className="block text-sm/6 font-medium text-gray-900 dark:text-white"
                >
                  وضعیت پروفایل
                </label>
                <div className="mt-2">
                  <input
                    value={user.isProfileCompleted ? 'تکمیل شده' : 'ناقص'}
                    disabled
                    id="profile-status"
                    name="profile-status"
                    type="text"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <Button
            type="submit"
          >
            ذخیره
          </Button>
          <Button
            type="button"
            variant={'outline'}
          >
            انصراف
          </Button>
        </div>
      </form>
    </Container>
  )
}
