'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    // Clear local storage, cookies, or call an API to invalidate the session
    localStorage.removeItem('token') // if using token auth

    // Optionally, call an API route to destroy a cookie/session
    fetch('/api/logout', { method: 'POST' }).catch(() => {})

    // Redirect to login or home
    router.push('/auth/login')
  }, [router])

  return (
    <div className="text-center mt-20 text-xl">
      Logging out...
    </div>
  )
}
