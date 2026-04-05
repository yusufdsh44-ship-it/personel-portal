export function generateRefCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  const bytes = new Uint8Array(8)
  crypto.getRandomValues(bytes)
  let code = "KPB-"
  for (let i = 0; i < 8; i++) code += chars[bytes[i] % chars.length]
  return code
}
