import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the RrPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-rr',
  templateUrl: 'rr.html',
})
export class RrPage {
  process: Array<{id: number, total: number, state: string, left: number, prior: number}> = []
  processor: Array<{id: number, process: number, total: number, left: number}> = []
  aptos: Array<{id: number, total: number, state: string, left: number, prior: number}> = []
  quantum: number = 0
  lastId: number = 0
  turnaround: number = 0

  constructor(public navCtrl: NavController, public navParams: NavParams) { 
    this.quantum = navParams.get("quantum")
    console.log(this.quantum)
    this.generateProcesses(navParams.get("processes"))
    this.generateProcessors(navParams.get("processors"), this.aptos)
    //this.escalonar(navParams.get("processors"))
    
    
  }

  generateRandomNumber(min, max){
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random()*(max-min))+min
  }

  generateProcesses(processes) { // gera os processos e coloca eles na fila de aptos
    let total
    let state = 'pronto'
    let prior
    for (let i = 0; i < processes; i++) {
      total = this.generateRandomNumber(4,20)
      prior = this.generateRandomNumber(0,3)
      this.process.push({id: this.lastId, total: total, state: state, left: total, prior: prior})
      this.aptos.push({id: this.lastId, total: total, state: state, left: total, prior: prior})
      this.lastId++
      this.turnaround = this.turnaround + total
    }
  }

  generateProcessors(processors, processes){
    let id = 0
    for (let i = 0; i < processors; i++) {
      if(processes.length > id){
        this.processor.push({id: id, process: processes[i].id, total: processes[i].total, left: processes[i].total})
        this.aptos.splice(i, 1); // processo retirado da lista de aptos 
        this.process[i].state = 'executando'
      }else{
        this.processor.push({id: id, process: null, total: null, left: null}) // cria processador sem processo
      }
      
      id++
    }
  }

  escalonar(processors:number){
    let counter = 0
    let counter2 = 0
    let intervalVar = setInterval(function(){ // cria thread de 1 segundo
      for (let i = 1; i <= processors; i++) {
        if(counter > this.turnaround){
          clearInterval(intervalVar); // para a thread se chegou ao fim
        }
        console.log("chegou aqui 1")
        if(counter2 == this.quantum){
          counter2 = 0
          this.process[this.processor[i].process].state = 'esperando' //
          //this.aptos.splice(this.processor[i].process, 1) //processo retirado da fila de aptos
          this.processor[i].process = this.aptos[0].id //coloca próximo na fila de aptos para executar
          this.processor[i].total = this.aptos[0].total
          this.processor[i].left = this.aptos[0].left

        }
        if(this.processor[i].left == 0){ //processo finalizado
          console.log("chegou aqui 2")
          this.process[this.processor[i].process].state = 'pronto' //status do processo volta a ser pronto
          this.aptos.splice(this.processor[i].process, 1) //processo retirado da fila de aptos
          this.processor[i].process = this.aptos[0].id //coloca próximo na fila de aptos para executar
          this.processor[i].total = this.aptos[0].total
          this.processor[i].left = this.aptos[0].left
        }else{
          this.processor[i].left = this.processor[i].left - 1 // conta um segundo no tempo restante dos processos em execução
          this.process[this.processor[i].process].left = this.process[this.processor[i].process].left - 1
          console.log("chegou aqui 4")
        }
      } 
      counter++ 
      counter2++      
    },1000)
  }

}
