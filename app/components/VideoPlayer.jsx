import { Suspense, lazy, useEffect, useState } from "react"
import ClientOnly from "./ClientOnly"

let ClientVideoPlayer = lazy(() => import("./ClientVideoPlayer"));
export default function Mappy(props){
  return (
    <>
      <ClientOnly>
        <Suspense fallback="FAIL">
          <ClientVideoPlayer
            guid={ props.guid }
            title={ props.title }
            mediaURL={ props.mediaURL }
          />
        </Suspense>
      </ClientOnly>
    </>
  )
}
