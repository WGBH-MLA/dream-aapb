// import { ExternalLink, ChevronDown } from 'lucide-react'

export default function DrawerMenu(props) {
  let items
  if (props.items) {
    items = props.items.map((item, index) => {
      return (
        <DrawerItem
          key={index}
          label={item.label}
          subLabel={item.subLabel}
          url={item.url}
          last={index == props.items.length - 1}
          external={item.external}
        />
      )
    })
  }

  let drawerClasses = 'drawermenu-container '
  if (props.classes) {
    drawerClasses += props.classes
  }

  return (
    <div className={drawerClasses}>
      <span className='drawermenu-label'>
        {props.label}
      </span>

      <div className='drawermenu-items'>{items}</div>
    </div>
  )
}

const DrawerItem = (props) => {
  let classes = "drawer-item"
  if(props.last){
    classes += " marbot"
  }
  return (
    <a
      className='drawer-item'
      href={props.url}
      {...(props.external ? { target: '_blank' } : {})}>
      <h4 className='drawer-title'>
        {props.label + ' '}
      </h4>
      <div className='drawer-subtitle'>{props.subLabel}</div>
    </a>)
}