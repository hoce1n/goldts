'use client'

import Link from 'next/link'
import {
  Popover,
  PopoverButton,
  PopoverBackdrop,
  PopoverPanel,
} from '@headlessui/react'
import { AnimatePresence, motion } from 'framer-motion'

import { Button } from './ui/button'
import { Container } from '@/components/Container'
import { Logo } from '@/components/Logo'
import { NavLinks } from '@/components/NavLinks'
import { useAuthStore } from '@/stores/auth.store'
import { ArrowLeft, Bell, ChevronDown, ShoppingBag, User } from 'lucide-react'
import { useLogout } from '@/hooks/Auth/useLogout'
import ConfirmDialog from './ConfirmDialog'
import { useState } from 'react'
import ShoppingCart from './ShoppingCart'
import { useCart } from '@/stores/cart'

function MenuIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M5 6h14M5 18h14M5 12h14"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ChevronUpIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M17 14l-5-5-5 5"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function MobileNavLink(
  props: Omit<
    React.ComponentPropsWithoutRef<typeof PopoverButton<typeof Link>>,
    'as' | 'className'
  >,
) {
  return (
    <PopoverButton
      as={Link}
      className="block text-base/7 tracking-tight text-gray-700"
      {...props}
    />
  )
}

export function Header() {
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);
  const { mutate: handleLogout, isPending } = useLogout();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const openCart = useCart((s) => s.openCart);
  const items = useCart((s) => s.items);

  const count = items.reduce((a, b) => a + b.quantity, 0);

  return (
    <header>
      <nav>
        <Container className="relative z-50 flex justify-between py-8">
          <div className="relative z-10 flex items-center gap-16">
            <Link href="/" aria-label="Home">
              <Logo className="h-10 w-auto" />
            </Link>
            <div className="hidden lg:flex lg:gap-10">
              <NavLinks />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Popover className="lg:hidden">
              {({ open }) => (
                <>
                  <PopoverButton
                    className="relative z-10 -m-2 inline-flex items-center rounded-lg stroke-gray-900 p-2 hover:bg-gray-200/50 hover:stroke-gray-600 focus:not-data-focus:outline-hidden active:stroke-gray-900"
                    aria-label="Toggle site navigation"
                  >
                    {({ open }) =>
                      open ? (
                        <ChevronUpIcon className="h-6 w-6" />
                      ) : (
                        <MenuIcon className="h-6 w-6" />
                      )
                    }
                  </PopoverButton>
                  <AnimatePresence initial={false}>
                    {open && (
                      <>
                        <PopoverBackdrop
                          static
                          as={motion.div}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="fixed inset-0 z-0 bg-gray-300/60 backdrop-blur-sm"
                        />
                        <PopoverPanel
                          static
                          as={motion.div}
                          initial={{ opacity: 0, y: -32 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{
                            opacity: 0,
                            y: -32,
                            transition: { duration: 0.2 },
                          }}
                          className="absolute inset-x-0 top-0 z-0 origin-top rounded-b-2xl bg-gray-50 px-6 pt-32 pb-6 shadow-2xl shadow-gray-900/20"
                        >
                          <div className="space-y-4">
                            <MobileNavLink href="/products">محصولات</MobileNavLink>
                            <MobileNavLink href="/#reviews">
                              تماس با ما
                            </MobileNavLink>
                            <MobileNavLink href="/#pricing">بلاگ</MobileNavLink>
                            <MobileNavLink href="/#faqs">
                              سوالات متداول
                            </MobileNavLink>
                          </div>
                          <div className="mt-8 flex flex-col gap-4">
                            {hydrated && user ? (
                              <>
                                <Link
                                  href={'/profile'}
                                  className="group flex w-full items-center justify-between gap-2"
                                >
                                  <span>پنل کاربری</span>
                                  <ArrowLeft className="transition-transform group-hover:block group-hover:-translate-x-2" />
                                </Link>
                                <Button
                                  onClick={() => setShowLogoutDialog(true)}
                                  variant="outline"
                                  className="flex gap-x-2 border-red-400 text-red-500 hover:border-red-600"
                                >
                                  خروج
                                </Button>
                              </>
                            ) : (
                              <Button
                                variant="outline"
                                className="relative flex gap-x-2"
                              >
                                <Link
                                  href={'/login'}
                                  className='absolute inset-0'
                                ></Link>
                                <span className="border-l pl-2">ورود</span>
                                <span>ثبت نام</span>
                              </Button>
                            )}
                          </div>
                        </PopoverPanel>
                      </>
                    )}
                  </AnimatePresence>
                </>
              )}
            </Popover>

            <div className="flex items-center gap-6 max-lg:hidden">
              {hydrated && user ? (
                <div className="flex gap-x-6">
                  <Bell />
                  <div className="flex items-center border-l pl-5">
                    <ChevronDown 
                      className="h-4 w-4" 
                      onClick={() => setShowLogoutDialog(true)}
                    />
                    <Link href={'/profile'}>
                      <User />
                    </Link>
                  </div>
                  <button onClick={openCart} className="relative">
                    <ShoppingBag className="cursor-pointer" />

                    {count > 0 && (
                      <span className="absolute -top-2 -right-2 text-xs bg-primary text-white rounded-full px-1.5">
                        {count}
                      </span>
                    )}
                  </button>
                </div>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="flex gap-x-2 relative"
                  >
                    <Link
                      href={"/login"}
                      className='absolute inset-0'
                    >
                    </Link>
                    <span className="border-l pl-2">ورود</span>
                    <span>ثبت نام</span>
                  </Button>
                </>
              )}
            </div>
          </div>
          <ConfirmDialog
            open={showLogoutDialog}
            title="خروج از حساب کاربری"
            description="آیا می‌خواهید از حساب کاربری خود خارج شوید؟"
            confirmText="خروج"
            cancelText="انصراف"
            loading={isPending}
            onCancel={() => setShowLogoutDialog(false)}
            onConfirm={() => {
              handleLogout()
              setShowLogoutDialog(false)
            }}
          />
          <ShoppingCart />
        </Container>
      </nav>
    </header>
  )
}
