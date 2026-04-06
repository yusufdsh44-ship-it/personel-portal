"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface TestUserInfo {
  adSoyad: string
  mudurluk: string
}

interface TestUserContextType {
  userInfo: TestUserInfo
  setUserInfo: (info: TestUserInfo) => void
}

const TestUserContext = createContext<TestUserContextType | null>(null)

export function TestUserProvider({ children }: { children: ReactNode }) {
  const [userInfo, setUserInfo] = useState<TestUserInfo>({ adSoyad: "", mudurluk: "" })

  useEffect(() => {
    // Geriye donuk temizlik: eski surumden kalan PII key'lerini sil
    sessionStorage.removeItem("test_adSoyad")
    sessionStorage.removeItem("test_mudurluk")
  }, [])

  return (
    <TestUserContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </TestUserContext.Provider>
  )
}

export function useTestUser() {
  const ctx = useContext(TestUserContext)
  if (!ctx) throw new Error("useTestUser must be used within TestUserProvider")
  return ctx
}
