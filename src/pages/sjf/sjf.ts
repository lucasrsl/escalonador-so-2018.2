import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the SjfPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sjf',
  templateUrl: 'sjf.html',
})
export class SjfPage {

  process: Array<{id: number, total: number, state: string, left: number, prior: number}>;
  processors: number;
  processes: number;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.processors = navParams.get("processors")
    this.processes = navParams.get("processes")
    this.generateProcesses(this.processes)
    
  }

  generateRandomNumber(min, max){
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random()*(max-min))+min
  }

  generateProcesses(qtd) {
    let id = 0
    let total
    let state = 'pronto'
    let prior
    for (let i = 0; i < qtd; i++) {
      total = this.generateRandomNumber(4,20)
      prior = this.generateRandomNumber(0,3)
      this.process.push({id: id, total: total, state: state, left: total, prior: prior})
      id=id+1
    }
  }

}
