export default function addSkipButton(vjs){
  const Button = vjs.getComponent("Button")

  function skipPlayer(player, skipLength){
    player.currentTime( player.currentTime() + skipLength )
  }

  class SkipForwardButton extends Button {
    handleClick(){
      skipPlayer(vjs.players["vjs-player"], 10)
    }
  }
  
  class SkipBackButton extends Button {
    handleClick(){
      skipPlayer(vjs.players["vjs-player"], -10)
    }
  }

  vjs.registerComponent("SkipBackButton", SkipBackButton)
  vjs.registerComponent("SkipForwardButton", SkipForwardButton)

  let cb = vjs.players["vjs-player"].getChild("controlBar")
  if(!cb.getChild("SkipBackButton")){
    cb.addChild("SkipBackButton", {})
    cb.getChild("SkipBackButton").addClass("vjs-icon-replay-10")
  }
  if(!cb.getChild("SkipForwardButton")){
    cb.addChild("SkipForwardButton", {})
    cb.getChild("SkipForwardButton").addClass("vjs-icon-forward-10")
  }
}
