export default class Record{
  constructor(props){
    this.data = props
    if(!this.data || !this.data.guid){
      console.log( 'problemsss', props )
      // throw "Input data invalid for Record!!"
    }
  }

  guid(){
    return this.data.guid
  }

  isAudio(){
    return this.data.media_type == "Sound"
  }

  isVideo(){
    return this.data.media_type == "Moving Image"
  }
}

