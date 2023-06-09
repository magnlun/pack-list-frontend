import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { ComponentsModule } from "../components/components.module";
import { MatButtonModule } from "@angular/material/button";
import { RouterModule } from "@angular/router";



@NgModule({
  declarations: [
    LoginComponent
  ],
  exports: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    MatButtonModule,
    RouterModule
  ]
})
export class LoginModule { }
