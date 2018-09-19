import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-rr',
  templateUrl: 'rr.html',
})
export class RrPage {
  aptos: Array<{id: number, total: number, state: string, left: number}> = []
  finalizados: Array<{id: number, total: number, state: string, left: number}> = []
  processor: Array<{id: number, process: number, total: number, left: number, state: string}> = []
  lastId: number = 0
  quantum: number = 0

  constructor(public navCtrl: NavController, public navParams: NavParams) { 
    this.generateProcesses(navParams.get("processes"))
    this.generateProcessors(navParams.get("processors"))
    this.quantum = navParams.get("quantum")
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
    for (let i = 0; i < processes; i++) {
      total = this.generateRandomNumber(4,20)
      this.aptos.push({id: this.lastId, total: total, state: state, left: total})
      this.lastId++
    }
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

  escalonar(processors:number){
    let counter = 0
    let intervalVar = setInterval(() => { // cria thread de 1 segundo
      for (let i = 0; i < processors; i++) {
        if(this.processor[i].left == 0){ // processo finalizado
          this.finalizados.push({id: this.processor[i].process, total: this.processor[i].total, state: 'pronto', left: this.processor[i].left})
          if(counter < this.quantum){
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
          }else{
            this.processor[i].process = null // libera o processador para receber próximos aptos
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
            if(counter < this.quantum){
              this.processor[i].left = this.processor[i].left - 1 // conta um segundo no tempo restante dos processos em execução
            }else{
              if(this.processor[i].left != 0){
                this.aptos.push({id: this.processor[i].process, total: this.processor[i].total, state: 'pronto', left: this.processor[i].left}) // coloca processo de volta na fila de aptos
              }
              this.processor[i].process = null // libera o processador para receber próximos aptos
              this.processor[i].total = null
              this.processor[i].left = null
            }
          }
        }
      } 
      if(counter < this.quantum){
        counter++ 
      }else{
        counter = 0
      }   
        
    },1000)
  }
}
