import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-rr',
  templateUrl: 'rr.html',
})
export class RrPage {
  aptos: Array<{id: number, bytes: number, total: number, state: string, left: number}> = []
  finalizados: Array<{id: number, bytes: number, total: number, state: string, left: number}> = []
  abortados: Array<{id: number, bytes: number, total: number, state: string, left: number}> = []
  processor: Array<{id: number, process: number, bytes: number, total: number, left: number, state: string}> = []
  busyBlocks: Array<{id: number, processId: number, total: number, used: number, next: number}> = []
  freeBlocks: Array<{id: number, total: number}> = []
  lastId: number = 0
  quantum: number = 0
  manager: string = ""
  totalMemory: number = 0

  constructor(public navCtrl: NavController, public navParams: NavParams) { 
    this.totalMemory = navParams.get("totalMemory")
    this.generateProcesses(navParams.get("processes"))
    this.generateProcessors(navParams.get("processors"))
    this.quantum = navParams.get("quantum")
    this.manager = navParams.get("manager")
    if(navParams.get("processes") == 69){
      alert("( ͡° ͜ʖ ͡°) ( ͡° ͜ʖ ͡°) ( ͡° ͜ʖ ͡°) ( ͡° ͜ʖ ͡°) ( ͡° ͜ʖ ͡°) ( ͡° ͜ʖ ͡°) ( ͡° ͜ʖ ͡°) ( ͡° ͜ʖ ͡°) ( ͡° ͜ʖ ͡°) ( ͡° ͜ʖ ͡°)")
    }
    if(this.manager == "bf") {
      this.escalonarb(navParams.get("processors"))

    }else if(this.manager == "mf") {
     // this.escalonarm(navParams.get("processors"))
    }
    
  }

  generateRandomNumber(min, max){
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random()*(max-min))+min
  }

  generateProcesses(processes) { // gera os processos e coloca eles na fila de aptos
    let total
    let bytes
    let state = 'pronto'
    for (let i = 0; i < processes; i++) {
      total = this.generateRandomNumber(10,30)
      bytes = this.generateRandomNumber(3, 1024)
      this.aptos.push({id: this.lastId, bytes: bytes, total: total, state: state, left: total})
      this.lastId++
    }
  }

  generateProcessors(processors){
    let id = 0
    for (let i = 0; i < processors; i++) {
      if(this.aptos.length > id){
        if(this.totalMemory >= this.aptos[0].bytes){  // coloca próximo processo da lista no processador
          this.totalMemory = this.totalMemory - this.aptos[0].bytes
          this.processor.push({id: id, process: this.aptos[0].id, bytes: this.aptos[0].bytes, total: this.aptos[0].total, left: this.aptos[0].total, state: 'executando'})
          this.busyBlocks.push({id: id, processId: this.aptos[0].id, total: this.aptos[0].bytes, used: this.aptos[0].bytes, next: 0})
          if(i > 0) {
            this.busyBlocks[i - 1].next = i
          }
        }else{
          this.abortados.push({id: this.aptos[0].id, bytes: this.aptos[0].bytes, total: this.aptos[0].total, left: this.aptos[0].total, state: 'abortado'})
        }
        this.aptos.splice(0, 1) // processo retirado da lista de aptos 
      }else{
        this.processor.push({id: id, process: null, bytes: null, total: null, left: null, state: null}) // cria processador sem processo
      }
      id++
    }
  }

  escalonarb(processors:number){
    let counter = 0
    let intervalVar = setInterval(() => { // cria thread de 1 segundo
      for (let i = 0; i < processors - 1; i++) {
        if(this.processor[i].left == 0){ // processo finalizado
          this.processoFinalizado(this.processor[i])
          if(counter < this.quantum){
            this.adicionarProcesso(i)
          }else{
            this.liberaProcessador(i)
          }
        }else if(this.processor[i].left == null){
          if(this.aptos.length != 0){
            this.proximoDaFila(i)
          }
        }else{
          if(this.processor[i].left != null){
            if(counter < this.quantum){
              this.processor[i].left = this.processor[i].left - 1 // conta um segundo no tempo restante dos processos em execução
            }else{
              if(this.processor[i].left != 0){
                this.aptos.push({id: this.processor[i].process, bytes: this.processor[i].bytes, total: this.processor[i].total, state: 'pronto', left: this.processor[i].left}) // coloca processo de volta na fila de aptos
              }
              this.liberaProcessador(i)
            }
          }
        }
      } 
      if(counter <= this.quantum){
        counter++ 
      }else{
        counter = 0
      }   
        
    },1000)
  }

  processoFinalizado(processor) {
    this.finalizados.push({id: processor.process, bytes: processor.bytes, total: processor.total, state: 'pronto', left: processor.left})
    for (let j = 0; j < this.busyBlocks.length; j++) {
      if(this.busyBlocks[j].processId == processor.process){
        this.totalMemory = this.totalMemory + this.busyBlocks[j].total
        this.freeBlocks.push({id: this.busyBlocks[j].id, total: this.busyBlocks[j].total})
        this.busyBlocks.splice(j ,1)
      }
    }
  }

  liberaProcessador(id) {
    this.processor[id].process = null // libera o processador para receber próximos aptos
    this.processor[id].bytes = null
    this.processor[id].total = null
    this.processor[id].left = null
  }

  proximoDaFila(id) {
    this.processor[id].process = this.aptos[0].id // coloca próximo na fila de aptos para executar
    this.processor[id].bytes = this.aptos[0].bytes
    this.processor[id].total = this.aptos[0].total
    this.processor[id].left = this.aptos[0].left
    this.aptos.splice(0, 1)
  }

  adicionarProcesso(id) {
    let bestfit = 0
    if(this.aptos.length != 0){
      if(this.aptos[0].bytes <= this.totalMemory){ // verifica se tem espaço na memória total para processar
        for (let j = 0; j < this.freeBlocks.length; j++) {
          if(this.freeBlocks[j].total <= this.aptos[0].bytes){ // verifica se algum bloco tem espaço para alocar processo
            if(bestfit > this.aptos[0].bytes){
              bestfit = j
            }
          }
        }
        this.busyBlocks.push({id: this.freeBlocks[bestfit].id, processId: this.aptos[0].id, total: this.freeBlocks[bestfit].total, used: this.aptos[0].bytes, next: this.freeBlocks[0].id})
        this.freeBlocks.splice(bestfit, 1)
        
        this.proximoDaFila(id)
        this.totalMemory = this.totalMemory - this.aptos[0].bytes
      }else{
        this.abortados.push({id: this.aptos[0].id, bytes: this.aptos[0].bytes, total: this.aptos[0].total, left: this.aptos[0].total, state: 'abortado'})
        this.aptos.splice(0, 1)
      }
    }else{
      this.liberaProcessador(id)
    }
  }

  // escalonarm(processors:number){
  //   let counter = 0
  //   let intervalVar = setInterval(() => { // cria thread de 1 segundo
  //     for (let i = 0; i < processors; i++) {
  //       if(this.processor[i].left == 0){ // processo finalizado
  //         this.finalizados.push({id: this.processor[i].process, bytes: this.processor[i].bytes, total: this.processor[i].total, state: 'pronto', left: this.processor[i].left})
  //         if(counter < this.quantum){
  //           if(this.aptos.length != 0){
  //             this.processor[i].process = this.aptos[0].id // coloca próximo na fila de aptos para executar
  //             this.processor[i].bytes = this.aptos[0].bytes
  //             this.processor[i].total = this.aptos[0].total
  //             this.processor[i].left = this.aptos[0].left
  //             this.aptos.splice(0, 1)
  //           }else{
  //             this.processor[i].process = null // deixa nulo se não tem processo na fila
  //             this.processor[i].bytes = null
  //             this.processor[i].total = null
  //             this.processor[i].left = null
  //           }
  //         }else{
  //           this.processor[i].process = null // libera o processador para receber próximos aptos
  //           this.processor[i].bytes = null
  //           this.processor[i].total = null
  //           this.processor[i].left = null
  //         }
  //       }else if(this.processor[i].left == null){
  //         if(this.aptos.length != 0){
  //           this.processor[i].process = this.aptos[0].id // coloca próximo na fila de aptos para executar
  //           this.processor[i].bytes = this.aptos[0].bytes
  //           this.processor[i].total = this.aptos[0].total
  //           this.processor[i].left = this.aptos[0].left
  //           this.aptos.splice(0, 1)
  //         }
  //       }else{
  //         if(this.processor[i].left != null){
  //           if(counter < this.quantum){
  //             this.processor[i].left = this.processor[i].left - 1 // conta um segundo no tempo restante dos processos em execução
  //           }else{
  //             if(this.processor[i].left != 0){
  //               this.aptos.push({id: this.processor[i].process, bytes: this.processor[i].bytes, total: this.processor[i].total, state: 'pronto', left: this.processor[i].left}) // coloca processo de volta na fila de aptos
  //             }
  //             this.liberaProcessador(i)
  //           }
  //         }
  //       }
  //     } 
  //     if(counter <= this.quantum){
  //       counter++ 
  //     }else{
  //       counter = 0
  //     }   
        
  //   },1000)
  // }
}
