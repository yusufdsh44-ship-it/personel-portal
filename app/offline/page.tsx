"use client"

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
      <span className="material-symbols-outlined text-on-surface-variant/40 mb-4" style={{ fontSize: 64 }}>
        wifi_off
      </span>
      <h1 className="font-heading text-2xl text-on-surface mb-2">
        Bağlantı Yok
      </h1>
      <p className="text-on-surface-variant max-w-sm">
        İnternet bağlantınız kesilmiş görünüyor. Lütfen bağlantınızı kontrol edip tekrar deneyin.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="mt-6 px-6 py-3 bg-primary text-on-primary rounded-full font-medium"
      >
        Tekrar Dene
      </button>
    </div>
  )
}
