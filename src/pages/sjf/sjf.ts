import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'Rxjs/rx';
import { Subscription } from "rxjs/Subscription";

@IonicPage()
@Component({
  selector: 'page-sjf',
  templateUrl: 'sjf.html',
})
export class SjfPage {
  observableVar: Subscription;
  process: Array<{id: number, total: number, state: string, left: number, prior: number}> = []
  processor: Array<{id: number, process: number, total: number, left: number}> = []
  aptos: Array<{id: number, total: number, state: string, left: number, prior: number}> = []
  lastId: number = 0
  turnaround: number = 0

  constructor(public navCtrl: NavController, public navParams: NavParams) { 
    this.generateProcesses(navParams.get("processes"))
    this.generateProcessors(navParams.get("processors"))
    this.escalonar(navParams.get("processors"))
    
    
  }

  generateRandomNumber(min, max){
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random()*(max-min))+min
  }

  sortProcesses(process:boolean, aptos:boolean){ // inserion sort
    if(process){
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
    if(aptos){
      for (let i = 1; i < this.aptos.length; i++)
      {
          let key = this.aptos[i]
          let j = i-1
  
          while (j >= 0 && this.aptos[j].total > key.total)
          {
              this.aptos[j + 1] = this.aptos[j]
              j = j - 1
          }
          this.aptos[j + 1] = key
      }
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
    this.sortProcesses(true, true)
  }

  generateProcessors(processors){
    let id = 0
    for (let i = 0; i < processors; i++) {
      if(this.process.length > id){
        this.processor.push({id: id, process: this.aptos[0].id, total: this.aptos[0].total, left: this.aptos[0].total}) // coloca próximo processo da lista no processador
        this.process[i].state = 'executando' // coloca o estado do processo em execução
        this.aptos.splice(0, 1) // processo retirado da lista de aptos 
        
      }else{
        this.processor.push({id: id, process: null, total: null, left: null}) // cria processador sem processo
      }
      
      id++
    }
    this.turnaround = this.turnaround / this.processor.length
  }

  escalonar(processors:number){
    let counter = 0
    /* this.observableVar = Observable.interval(1000).subscribe(()=>{
      this.functionYouWantToCall();
      });
  
      ionViewDidLeave(){
        this.observableVar.unsubscribe();
      } */
    let intervalVar = setInterval(() => { // cria thread de 1 segundo
      console.log(this.processor)
      for (let i = 0; i < processors; i++) {
        if(counter > this.turnaround){
          clearInterval(intervalVar) // para a thread se chegou ao fim
          alert("Acabou!")
        }
        console.log(this.processor[i]);

        if(this.processor[i].left == 0){ //processo finalizado
          this.process[this.processor[i].process].state = 'pronto' //status do processo volta a ser pronto
          if(this.aptos.length != 0){
            this.processor[i].process = this.aptos[0].id //coloca próximo na fila de aptos para executar
            this.processor[i].total = this.aptos[0].total
            this.processor[i].left = this.aptos[0].total
            this.aptos.splice(0, 1)
          }else{
            this.processor[i].process = null //coloca próximo na fila de aptos para executar
            this.processor[i].total = null
            this.processor[i].left = null
          }
        }else{
          if(this.processor[i].left != null){
            this.processor[i].left = this.processor[i].left - 1 // conta um segundo no tempo restante dos processos em execução
            this.process[this.processor[i].process].left = this.process[this.processor[i].process].left - 1
          }
        }
      } 
      counter++       
    },1000)
  }

}
