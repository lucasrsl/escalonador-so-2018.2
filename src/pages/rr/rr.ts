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
  blocks: Array<{processId: number, total: number, used: number}> = []
  lastId: number = 0
  quantum: number = 0
  manager: string = ""
  totalMemory: number = 0

  constructor(public navCtrl: NavController, public navParams: NavParams) { 
    this.totalMemory = navParams.get("totalMemory")
    this.generateProcesses(navParams.get("processes"))
    this.generateProcessors(navParams.get("processors"))
    this.quantum = navParams.get("quantum")
    // this.manager = navParams.get("manager")
    if(navParams.get("processes") == 69){
      alert("( ͡° ͜ʖ ͡°) ( ͡° ͜ʖ ͡°) ( ͡° ͜ʖ ͡°) ( ͡° ͜ʖ ͡°) ( ͡° ͜ʖ ͡°) ( ͡° ͜ʖ ͡°) ( ͡° ͜ʖ ͡°) ( ͡° ͜ʖ ͡°) ( ͡° ͜ʖ ͡°) ( ͡° ͜ʖ ͡°)")
    }

    // if(this.manager == "bf") {
    //   this.escalonarb(navParams.get("processors"))

    // }else if(this.manager == "mf") {
    //  // this.escalonarm(navParams.get("processors"))
    // }
    
  }

  iniciar() {
    this.escalonarb(this.navParams.get("processors"))
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
    for (let i = 0; i < processors; i++) {
      if(this.aptos.length >= i){
        if(this.totalMemory >= this.aptos[0].bytes){  // coloca próximo processo da lista no processador
          this.totalMemory = this.totalMemory - this.aptos[0].bytes
          this.processor.push({id: i, process: this.aptos[0].id, bytes: this.aptos[0].bytes, total: this.aptos[0].total, left: this.aptos[0].total, state: 'executando'})
          this.blocks.push({processId: this.aptos[0].id, total: this.aptos[0].bytes, used: this.aptos[0].bytes})
        }else{
          this.abortados.push({id: this.aptos[0].id, bytes: this.aptos[0].bytes, total: this.aptos[0].total, left: this.aptos[0].total, state: 'abortado'})
          this.processor.push({id: i, process: null, bytes: null, total: null, left: null, state: null}) // cria processador sem processo
        }
        this.aptos.splice(0, 1) // processo retirado da lista de aptos 
      }else{
        this.processor.push({id: i, process: null, bytes: null, total: null, left: null, state: null}) // cria processador sem processo
      }
    }
  }

  escalonarb(processors:number){
    let counter = 0
    let intervalVar = setInterval(() => { // cria thread de 1 segundo
      for (let i = 0; i < processors; i++) {
        if(this.processor[i].left == 0){ // processo finalizado
          this.processoFinalizado(this.processor[i])
          if(counter < this.quantum){
            this.adicionarProcesso(i)
          }else{
            this.liberaProcessador(i)
          }
        }else if(this.processor[i].left == null){ // processador vazio
          if(this.aptos.length != 0){
            this.adicionarProcesso(i)
          }
        }else{ // processo não finalizado
          if(counter < this.quantum){ // quantum ainda não foi atingido
            this.processor[i].left = this.processor[i].left - 1 // conta um segundo no tempo restante dos processos em execução
          }else{ //quantum atingido
            if(this.processor[i].left != 0){ 
              this.aptos.push({id: this.processor[i].process, bytes: this.processor[i].bytes, total: this.processor[i].total, state: 'pronto', left: this.processor[i].left}) // coloca processo de volta na fila de aptos
            }
            this.liberaProcessador(i)
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
  
  adicionarProcesso(id) {
    let bestfit = 0
    let bestfitId = -1
    if(this.aptos.length != 0){
      if(this.aptos[0].bytes <= this.totalMemory){ // verifica se tem espaço na memória total para processar
        let existe = false
        for (let i = 0; i < this.blocks.length; i++) {
          if(this.blocks[i].processId == this.aptos[0].id){
            existe = true
            bestfitId = i
          }
          
        }
        if(existe == true) {
          this.blocks[bestfitId].processId = this.aptos[0].id
          this.blocks[bestfitId].used = this.aptos[0].bytes

        }else {
          this.blocks.push({processId: this.aptos[0].id, total: this.aptos[0].bytes, used: this.aptos[0].bytes})
          this.totalMemory = this.totalMemory - this.aptos[0].bytes

        }
        this.proximoDaFila(id)
      }else{
        for (let j = 0; j < this.blocks.length; j++) {
          if(this.blocks[j].processId == -1) {
            if(this.blocks[j].total >= this.aptos[0].bytes){ // verifica se algum bloco tem espaço para alocar processo
              if(this.aptos[0].bytes >= bestfit){
                bestfitId = j
                bestfit = this.blocks[j].total
              }
            }
          }
          if(this.blocks[j].processId == this.aptos[0].id){
            bestfitId = j
          }
        }
        if(bestfitId == -1) {
          this.abortados.push({id: this.aptos[0].id, bytes: this.aptos[0].bytes, total: this.aptos[0].total, left: this.aptos[0].total, state: 'abortado'})
          this.aptos.splice(0, 1)
        }else {
          this.blocks[bestfitId].processId = this.aptos[0].id
          this.blocks[bestfitId].used = this.aptos[0].bytes
          this.proximoDaFila(id)
        }
      }
    }else{
      this.liberaProcessador(id)
    }
  }

  processoFinalizado(processor) {
    this.finalizados.push({id: processor.process, bytes: processor.bytes, total: processor.total, state: 'pronto', left: processor.left})
    for (let j = 0; j < this.blocks.length; j++) {
      if(this.blocks[j].processId == processor.process){
        this.blocks[j].used = 0
        this.blocks[j].processId = -1
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
