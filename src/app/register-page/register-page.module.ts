import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterPageComponent } from './register-page.component';
import { ComponentsModule } from "../components/components.module";
import { MatButtonModule } from "@angular/material/button";



@NgModule({
  declarations: [
    RegisterPageComponent
  ],
    imports: [
        CommonModule,
        ComponentsModule,
        MatButtonModule
    ]
})
export class RegisterPageModule { }
