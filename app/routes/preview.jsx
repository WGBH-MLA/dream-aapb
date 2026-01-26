import { useLoaderData } from 'react-router';
import { LoaderFunctionArgs } from 'react-router';
import { getPreview } from '../utils/preview'
import { renderCollection } from '../classes/collectionPresenter'
import { renderExhibit } from '../classes/exhibitPresenter'
import { getPageBySlug } from '../utils/fetch'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  var params = new URLSearchParams(request.url.replace(/.*\?/, ''))

  // leaving existing lookup by id, since current preview link provides only it
  if (params.has('content_type') && params.has('token')) {
    var id = params.get('token').split(':')[0].replace(/id=/g, '')
    return await getPreview(id, params.get('content_type'), params.get('token'))
  } else {
    throw new Error('Missing content_type or token!! No!')
  }
}

export default function Preview() {
  const preview = useLoaderData()

  if (!(preview && preview.meta)) {
    throw new Error('Not found!')
  }

  let rendered
  if (preview.meta.type == 'aapb_collections.AAPBCollection') {
    rendered = renderCollection(preview)
  } else if (preview.meta.type == 'aapb_exhibits.AAPBExhibit') {
    rendered = renderExhibit(preview)
  }

  return (
    <div>
      <div className="page-container">
        <div className="page-body-container">{rendered}</div>
      </div>
    </div>
  )
}
