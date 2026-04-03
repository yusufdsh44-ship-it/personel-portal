"use client"

export function Header({ title = "Kurumsal Psikoloji Birimi", rightContent }: { title?: string; rightContent?: React.ReactNode }) {
  return (
    <header className="bg-surface-container-low/80 backdrop-blur-md fixed top-0 w-full z-50 shadow-sm shadow-black/5">
      <div className="flex items-center justify-between px-6 py-4 w-full max-w-2xl mx-auto">
        <h1 className="text-on-surface font-bold text-base font-headline tracking-tight">{title}</h1>
        {rightContent}
      </div>
    </header>
  )
}
