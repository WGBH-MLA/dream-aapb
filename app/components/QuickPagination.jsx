export default function QuickPagination(props){
  let currentPage = props.currentPage || 0
  let pageLinks = []
  for(var i=0; i<props.numPages; i++){
    pageLinks.push( <PageLink baseURL={ props.baseURL } pageNumber={ i } handleChangePage={ props.handleChangePage } /> )
  }
  return (
    <div>
      { pageLinks }
    </div>
  )
}

function PageLink(props){
  return <a href={ `/${props.baseURL}?page=${props.pageNumber}` } onClick={ props.handleChangePage }>{ props.pageNumber+1 }</a>
}
