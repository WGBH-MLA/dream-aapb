import { useEffect } from 'react'

export default function InvitingSidebar(props){
  let links
  if(props.links){
    links = props.links.map((link) => {
      return renderSidebarLink(link.url, link.text)
    })    
  }

  useEffect(() => {
    const sidebarMenu = document.getElementsByClassName('sidey-sidebar')[0]
    const initialSidebarTop = sidebarMenu?.offsetTop
    // sidebarMenu.style.backgroundColor = "#00f"
    
    window.addEventListener('scroll', () => {
      let scrollTop = document.documentElement.scrollTop

      if (scrollTop > initialSidebarTop) {
        // bar is at top position

        var distanceFromBottom
        var sbLinks = document.querySelectorAll('div.sidey-sidebar ul li')
        if (sbLinks.length > 0) {
          // there could be no sidebar elements if ex has no authors and no headings and no footnotes
          var lastSbLink = sbLinks[sbLinks.length - 1]
          var sbRect = lastSbLink.getBoundingClientRect()
          var clientTop =
            document.documentElement.clientTop || document.body.clientTop || 0
          var top = sbRect.top + scrollTop - clientTop

          var distanceFromBottom =
            document.body.scrollHeight - top + sbRect.height

          if (distanceFromBottom / document.body.scrollHeight < 0.36) {
            // bar is close enough (36vh) to the footer, stop
            // sidebarMenu.style.backgroundColor = "#f00"
            sidebarMenu.style.position = 'sticky'
            sidebarMenu.style.width = '115%'

            document.getElementsByClassName("sidey-sidebar-container")[0].classList.remove("floating")
          }
        }
      } else {
        // sidebar is in top position (page header showing)
        sidebarMenu.style.top = initialSidebarTop - scrollTop + 'px'
        sidebarMenu.style.position = 'fixed'
        // sidebarMenu.style.backgroundColor = "#0f0"
        sidebarMenu.style.width = '100%'

        document.getElementsByClassName("sidey-sidebar-container")[0].classList.add("floating")
      
      }
    })

  }, [])

  return (
    <div className="sidey-sidebar-container">
      <div className="sidey-sidebar bmarbot">
        <a className="sidey-sidebar-title" href={ props.titleURL }>
          <h2 className="smartop smarbot">{ props.titleText }</h2>
        </a>
        <hr />
        <ul>
          { links }
        </ul>
      </div>
    </div>
  )
}

function renderSidebarLink(url, text, selected=false){
  let classes = "marbot "
  classes += selected ? " selected" : ""
  return <li className={classes}><a href={ url }>{ text }</a></li>
}
