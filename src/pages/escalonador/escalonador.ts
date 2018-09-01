import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-escalonador',
  templateUrl: 'escalonador.html',
})
export class EscalonadorPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  pushPage(page, Np, Pi) {
    if(page=='sjf'){
      this.navCtrl.push('SjfPage', {
        processors: Np,
        processes: Pi
      })
    }else if(page=='rr'){
      this.navCtrl.push('RrPage', {
        processors: Np,
        processes: Pi
      })
    }else{
      this.navCtrl.push('LtgPage', {
        processors: Np,
        processes: Pi
      })
    }
  }

}
