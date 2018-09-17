import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-escalonador',
  templateUrl: 'escalonador.html',
})
export class EscalonadorPage {
  data = {x:"", y:"", z:"", w:""}
  visability: boolean = false
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  pushPage() {
    if(this.data.x==='sjf'){
      this.navCtrl.push('SjfPage', {
        processors: this.data.y,
        processes: this.data.z
      })
    }else if(this.data.x==='rr'){
      this.navCtrl.push('RrPage', {
        processors: this.data.y,
        processes: this.data.z,
        quantum: this.data.w
      })
    }else if(this.data.x==='ltg'){
      this.navCtrl.push('LtgPage', {
        processors: this.data.y,
        processes: this.data.z
      })
    }
  }

  onChange(item){
    if(item == 'rr'){
      this.visability = true;
    }else{
      this.visability = false;
    }
  }

}
