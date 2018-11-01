import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-ltg',
  templateUrl: 'ltg.html',
})
export class LtgPage {
  aptos: Array<{id: number, total: number, state: string, left: number, deadline: number}> = []
  finalizados: Array<{id: number, total: number, state: string, left: number}> = []
  abortados: Array<{id: number, total: number, state: string, left: number, deadline: number}> = []
  processor: Array<{id: number, process: number, total: number, left: number, state: string}> = []
  lastId: number = 0

  constructor(public navCtrl: NavController, public navParams: NavParams) { 
    this.generateProcesses(navParams.get("processes"))
    this.generateProcessors(navParams.get("processors"))
    if(navParams.get("processes") == 69){
      alert("( ͡° ͜ʖ ͡°) ( ͡° ͜ʖ ͡°) ( ͡° ͜ʖ ͡°) ( ͡° ͜ʖ ͡°) ( ͡° ͜ʖ ͡°) ( ͡° ͜ʖ ͡°) ( ͡° ͜ʖ ͡°) ( ͡° ͜ʖ ͡°) ( ͡° ͜ʖ ͡°) ( ͡° ͜ʖ ͡°)")
    }
    this.escalonar(navParams.get("processors"))
    
    
  }

  generateRandomNumber(min, max){
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random()*(max-min))+min
  }

  generateProcesses(processes) { // gera os processos e coloca eles na fila de aptos
    let total
    let state = 'pronto'
    let deadline
    for (let i = 0; i < processes; i++) {
      total = this.generateRandomNumber(4, 20)
      deadline = this.generateRandomNumber(4, 20)
      this.aptos.push({id: this.lastId, total: total, state: state, left: total, deadline: deadline})
      this.lastId++
    }
    this.sortProcesses()
  }

  generateProcessors(processors){
    let id = 0
    for (let i = 0; i < processors; i++) {
      if(this.aptos.length > id){
        this.processor.push({id: id, process: this.aptos[0].id, total: this.aptos[0].total, left: this.aptos[0].total, state: 'executando'}) // coloca próximo processo da lista no processador
        this.aptos.splice(0, 1) // processo retirado da lista de aptos 
      }else{
        this.processor.push({id: id, process: null, total: null, left: null, state: null}) // cria processador sem processo
      }
      id++
    }
  }

  sortProcesses(){ // inserion sort
    for (let i = 1; i < this.aptos.length; i++)
    {
        let key = this.aptos[i]
        let j = i-1

        while (j >= 0 && this.aptos[j].deadline > key.deadline)
        {
            this.aptos[j + 1] = this.aptos[j]
            j = j - 1
        }
        this.aptos[j + 1] = key
    }
  }

  escalonar(processors:number){
    let intervalVar = setInterval(() => { // cria thread de 1 segundo
      for (let j = 0; j < this.aptos.length; j++) {
        if(this.aptos[j].deadline != 0){
          this.aptos[j].deadline--
        }else{
          this.abortados.push({id: this.aptos[j].id, total: this.aptos[j].total, state: 'abortado', left: this.aptos[j].left, deadline: this.aptos[j].deadline})
          this.aptos.splice(j, 1)
        } 
      }
      for (let i = 0; i < processors; i++) {
        if(this.processor[i].left == 0){ // processo finalizado
          this.finalizados.push({id: this.processor[i].process, total: this.processor[i].total, state: 'pronto', left: this.processor[i].left})
          if(this.aptos.length != 0){
            this.processor[i].process = this.aptos[0].id // coloca próximo na fila de aptos para executar
            this.processor[i].total = this.aptos[0].total
            this.processor[i].left = this.aptos[0].left
            this.aptos.splice(0, 1)
          }else{
            this.processor[i].process = null // deixa nulo se não tem processo na fila
            this.processor[i].total = null
            this.processor[i].left = null
          }
        }else if(this.processor[i].left == null){
          if(this.aptos.length != 0){
            this.processor[i].process = this.aptos[0].id // coloca próximo na fila de aptos para executar
            this.processor[i].total = this.aptos[0].total
            this.processor[i].left = this.aptos[0].left
            this.aptos.splice(0, 1)
          }
        }else{
          if(this.processor[i].left != null){
            this.processor[i].left = this.processor[i].left - 1 // conta um segundo no tempo restante dos processos em execução
          }
        }
      }    
      this.sortProcesses()   
    },1000)
  }

}
