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
  aptos: Array<{id: number, total: number, state: string, left: number, prior: number}> = []
  lastId: number = 0
  turnaround: number = 0

  constructor(public navCtrl: NavController, public navParams: NavParams) { 
    this.generateProcesses(navParams.get("processes"))
    this.generateProcessors(navParams.get("processors"), this.aptos)
    //this.escalonar(navParams.get("processors"))
    
    
  }

  generateRandomNumber(min, max){
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random()*(max-min))+min
  }

  sortProcesses(){ // inserion sort
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
    this.sortProcesses()
  }

  generateProcessors(processors, processes){
    let id = 0
    for (let i = 0; i < processors; i++) {
      if(processes.length > id){
        this.processor.push({id: id, process: processes[i].id, total: processes[i].total, left: processes[i].total})
        let j = this.aptos[this.aptos.length - 1]
        this.aptos[this.aptos.length - 1] = this.aptos[i]
        this.aptos[i]
        //this.aptos.splice(i, 1); // processo retirado da lista de aptos 
        this.process[i].state = 'executando'
        
      }else{
        this.processor.push({id: id, process: null, total: null, left: null}) // cria processador sem processo
      }
      
      id++
    }
    console.log(this.processor)
  }

  escalonar(processors:number){
    let counter = 0
    let intervalVar = setInterval(function(){ // cria thread de 1 segundo
      for (let i = 1; i <= processors; i++) {
        if(counter > this.turnaround){
          clearInterval(intervalVar); // para a thread se chegou ao fim
        }
        console.log("chegou aqui 1")

        if(this.processor[i].left == 0){ //processo finalizado
          console.log("chegou aqui 2")
          this.process[this.processor[i].process].state = 'pronto' //status do processo volta a ser pronto
          this.aptos.splice(this.processor[i].process, 1) //processo retirado da fila de aptos
          this.processor[i].process = this.aptos[0].id //coloca próximo na fila de aptos para executar
          this.processor[i].total = this.aptos[0].total
          this.processor[i].left = this.aptos[0].total
          /* let x = 0
          while (this.processor[i].total == 0) {
            if(this.aptos[x].left != 0){
              this.processor[i].process = this.aptos[x].id
              this.processor[i].total = this.aptos[x].total
              this.processor[i].left = this.aptos[x].total
              console.log("chegou aqui 3")
              break
            }
            x++
          } */
        }else{
          this.processor[i].left = this.processor[i].left - 1 // conta um segundo no tempo restante dos processos em execução
          this.process[this.processor[i].process].left = this.process[this.processor[i].process].left - 1
          console.log("chegou aqui 4")
        }
      } 
      counter++       
    },1000)
  }

}
