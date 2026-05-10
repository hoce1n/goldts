import { type Metadata } from 'next'
import { AuthLayout } from '@/components/AuthLayout'
import { LoginForm } from '@/components/LoginForm'

export const metadata: Metadata = {
  title: 'ورود',
}

export default function Login() {

  return (
    <AuthLayout
      title="به فروشگاه طلای محبی خوش آمدید."
      subtitle={
        <>شماره موبایل خود را وارد کنید.</>
      }
    >
      <LoginForm />
    </AuthLayout>
  )
}
