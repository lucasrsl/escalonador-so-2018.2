import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EscalonadorPage } from './escalonador';

@NgModule({
  declarations: [
    EscalonadorPage,
  ],
  imports: [
    IonicPageModule.forChild(EscalonadorPage),
  ],
})
export class EscalonadorPageModule {}
