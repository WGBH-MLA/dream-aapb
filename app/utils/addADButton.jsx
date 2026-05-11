export default function addADButton(vjs, adURL){
  const MenuButton = vjs.getComponent("MenuButton")
  const MenuItem = vjs.getComponent("MenuItem")

  class ADMenuItem extends MenuItem {
    constructor(player, options) {
      options.selectable = true
      super(player, options)
      this.controlText(options.label)
      this.on(player, 'adchange', this.update)
      this.update()
    }

    handleClick() {
      const player = this.player()
      const currentTime = player.currentTime()
      const wasPaused = player.paused()
      const turningOn = this.options_.value === 'on'
      
      if (turningOn) {
        player.src({ src: adURL, type: 'application/x-mpegURL' })
        player.adActive_ = true
      } else {
        player.src(player.originalSources_)
        player.adActive_ = false
      }
      
      const button = player.getChild('controlBar').getChild('ADMenuButton')
      if (button){
        button.toggleClass('vjs-ad-active', player.adActive_)
      }
      
      player.currentTime(currentTime)
      if (!wasPaused) player.play()
      
      player.trigger('adchange')
    }
    
    update() {
      const isActive = this.player().adActive_ === true
      
      this.selected(
        (this.options_.value === 'on' && isActive) ||
        (this.options_.value === 'off' && !isActive)
      )
    }
  }

  class ADMenuButton extends MenuButton {
    constructor(player, options) {
      super(player, options)
      this.controlText('Audio Description')
      this.addClass('vjs-audio-description-button')

      if (!player.originalSources_) {
        player.originalSources_ = player.currentSources()
      }
    }
    
    buildCSSClass() {
      return `vjs-menu-button-popup vjs-control vjs-button ${super.buildCSSClass()}`
    }
    
    createItems() {
      return [
        new ADMenuItem(this.player_, { label: 'Off', value: 'off' }),
        new ADMenuItem(this.player_, { label: 'On', value: 'on' })
      ]
    }
  }

  // actually add it
  vjs.registerComponent('ADMenuButton', ADMenuButton)
}