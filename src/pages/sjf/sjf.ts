import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-sjf',
  templateUrl: 'sjf.html',
})
export class SjfPage {
  process: Array<{id: number, total: number, state: string, left: number, prior: number}> = []
  processor: Array<{id: number, process: number, total: number, left: number}> = []
  lastId: number = 1

  constructor(public navCtrl: NavController, public navParams: NavParams) { 
    this.generateProcesses(navParams.get("processes"))
    this.generateProcessors(navParams.get("processors"), this.process)
    //this.escalonar(navParams.get("processors"))
    
    
  }

  generateRandomNumber(min, max){
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random()*(max-min))+min
  }

  sortProcesses(){
    for (let i = 1; i < this.process.length; i++)
    {
        let key = this.process[i]
        let j = i-1

        while (j >= 0 && this.process[j].total > key.total)
        {
            this.process[j + 1] = this.process[j]
            j = j - 1
        }
        this.process[j + 1] = key
    }
  }

  generateProcesses(processes) {
    let total
    let state = 'pronto'
    let prior
    for (let i = 0; i < processes; i++) {
      total = this.generateRandomNumber(4,20)
      prior = this.generateRandomNumber(0,3)
      this.process.push({id: this.lastId, total: total, state: state, left: total, prior: prior})
      this.lastId++
    }
    this.sortProcesses()
  }

  generateProcessors(processors, processes){
    let id = 1
    for (let i = 0; i < processors; i++) {
      if(processes.length >= id){
        this.processor.push({id: id, process: processes[i].id, total: processes[i].total, left: processes[i].total})
      }else{
        this.processor.push({id: id, process: 0, total: 0, left: 0})
      }
      
      id++
    }
  }

  escalonar(processors){
    let counter = 0
    let turnaround
    for (let t = 0; t < this.process.length; t++) {
      turnaround = turnaround + this.process[t].total
    }

    let intervalVar = setInterval(function(){
      for (let i = 0; i < processors; i++) {
        if(counter > turnaround){
          clearInterval(intervalVar);
        }

        if(this.process[this.processor[i].process].left == 0){
          let counter2 = 0
          while(this.process[this.processor[i].process] != 0){
            if(this.process[this.processor[i].process].state = 'pronto'){
              this.processor[i].process = this.process[this.processor[i].process].id
              this.processor[i].total = this.process[this.processor[i].process].total
              this.processor[i].left = this.process[this.processor[i].process].total
            }
            counter2++
          }
          counter2 = 0
          this.processor[i]
        }else{
          this.process[this.processor[i].process].left = this.process[this.processor[i].process].left - 1
        }
      } 
      counter++       
    },1000)
  }

}
