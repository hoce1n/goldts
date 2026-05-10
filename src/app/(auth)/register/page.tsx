import { type Metadata } from 'next'

import { AuthLayout } from '@/components/AuthLayout'
import RegisterForm from '@/components/RegisterForm'

export const metadata: Metadata = {
  title: 'تکمیل مشخصات',
}

export default function Register() {
  return (
    <AuthLayout
      title="تکمیل حساب کاربری"
      subtitle={
        <>
           برای استفاده از امکانات سایت، لازم است تا اطلاعات خود را تکمیل کنید.
        </>
      }
    >
      <RegisterForm />
    </AuthLayout>
  )
}
