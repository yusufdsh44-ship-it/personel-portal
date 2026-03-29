import type { Metadata } from "next"
import { PsikologContent } from "./psikolog-content"

export const metadata: Metadata = {
  title: "Psikolog — Sakin Siginak",
  description: "Uzm. Kl. Psk. Yusuf Pamuk — Arnavutkoy Belediyesi Kurumsal Psikoloji Birimi",
}

export default function PsikologPage() {
  return <PsikologContent />
}
