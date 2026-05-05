import { Suspense, lazy } from "react"
import ClientOnly from "./ClientOnly"

let ClientTranscriptViewer = lazy(() => import("./ClientTranscriptViewer"));
export default function TranscriptViewer(props){
  return (
    <>
      <ClientOnly>
        <Suspense fallback="Loading...">
          <ClientTranscriptViewer
            lines={ props.lines }
            viewerOpen={ props.viewerOpen }
            handleViewerToggle={ props.handleViewerToggle }
          />
        </Suspense>
      </ClientOnly>
    </>
  )
}
