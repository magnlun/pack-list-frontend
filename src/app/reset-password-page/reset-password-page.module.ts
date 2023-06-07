import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResetPasswordPageComponent } from './reset-password-page.component';
import { ComponentsModule } from "../components/components.module";
import { MatButtonModule } from "@angular/material/button";



@NgModule({
  declarations: [
    ResetPasswordPageComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    MatButtonModule
  ]
})
export class ResetPasswordPageModule { }
