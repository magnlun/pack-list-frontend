import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForgotPasswordPageComponent } from './forgot-password-page.component';
import { ComponentsModule } from "../components/components.module";
import { MatButtonModule } from "@angular/material/button";



@NgModule({
  declarations: [
    ForgotPasswordPageComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    MatButtonModule
  ]
})
export class ForgotPasswordPageModule { }
