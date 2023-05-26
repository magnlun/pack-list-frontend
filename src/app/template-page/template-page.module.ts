import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplatePageComponent } from './template-page.component';
import { MatCardModule } from "@angular/material/card";
import { ComponentsModule } from "../components/components.module";



@NgModule({
  declarations: [
    TemplatePageComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    ComponentsModule
  ]
})
export class TemplatePageModule { }
