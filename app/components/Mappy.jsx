import { Suspense, lazy } from "react"
import ClientOnly from "./ClientOnly"

let ClientMap = lazy(() => import("./ClientMap"));
export default function Mappy(props){
  return (
    <>
      <ClientOnly>
        <Suspense fallback="Loading...">
          <ClientMap />
        </Suspense>
      </ClientOnly>
    </>
  )
}
