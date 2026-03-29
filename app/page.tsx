import type { Metadata } from "next"
import { PsikologContent } from "./psikolog/psikolog-content"

export const metadata: Metadata = {
  title: "Sakin Sığınak — Kurumsal Psikoloji Birimi",
  description: "Uzm. Kl. Psk. Yusuf Pamuk — Arnavutköy Belediyesi Kurumsal Psikoloji Birimi",
}

export default function HomePage() {
  return <PsikologContent />
}
