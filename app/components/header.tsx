"use client"

export function Header({ title, rightContent }: { title?: string; rightContent?: React.ReactNode }) {
  return (
    <header className="bg-teal-50/80 backdrop-blur-md fixed top-0 w-full z-50 shadow-sm shadow-teal-900/5">
      <div className="flex items-center justify-between px-6 py-4 w-full max-w-2xl mx-auto">
        {title && <h1 className="text-teal-900 font-bold text-base font-headline tracking-tight">{title}</h1>}
        {rightContent}
      </div>
    </header>
  )
}
