import { Suspense, lazy, useEffect, useState } from "react"

// because it looooooooooooooooooooooves window and therefore will only load on the client
let ClientMap = lazy(() => import("./ClientMap"));

export function ClientOnly({children}){
  let [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  return mounted ? <>{children}</> : null
}

export default function Map(props){
  return (
    <>
      <ClientOnly>
        <Suspense fallback="FAILUER">
          <ClientMap />
        </Suspense>
      </ClientOnly>
    </>
  )
}
