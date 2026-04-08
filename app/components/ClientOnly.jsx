import { useEffect, useState } from "react"

export default function ClientOnly({children}){
  let [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  return mounted ? <>{children}</> : null
}
