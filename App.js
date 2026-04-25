// App.js
import React, { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import LoginScreen from './screens/LoginScreen'
import HomeScreen from './screens/HomeScreen'
// ایمپورت سرویس نوتیفیکیشن (مسیر را چک کنید)
import { registerForPush, savePushToken } from './services/notifications' 

export default function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    // ۱. بررسی سشن اولیه
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
    })

    // ۲. شنود تغییرات اتنتیکیشن
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
      }
    )

    // ۳. راه‌اندازی نوتیفیکیشن (این بخش به داخل کامپوننت منتقل شد)
    const initPush = async () => {
      try {
        const token = await registerForPush()
        if (token) {
          await savePushToken(token)
        }
      } catch (error) {
        console.log('Push notification setup failed:', error)
      }
    }
    initPush()

    // Cleanup function
    return () => {
      if (listener?.subscription) {
        listener.subscription.unsubscribe()
      }
    }
  }, []) // Dependency array خالی تا فقط یکبار اجرا شود

  // رندر شرطی: اگر سشن بود هوم، وگرنه لاگین
  return session ? <HomeScreen /> : <LoginScreen />
}