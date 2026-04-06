import { TestUserProvider } from "./test-context"

export default function TestIdLayout({ children }: { children: React.ReactNode }) {
  return <TestUserProvider>{children}</TestUserProvider>
}
