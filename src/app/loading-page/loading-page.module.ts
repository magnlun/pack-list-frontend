import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingPageComponent } from './loading-page.component';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatIconModule } from "@angular/material/icon";



@NgModule({
    declarations: [
        LoadingPageComponent
    ],
    exports: [
        LoadingPageComponent
    ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule
  ]
})
export class LoadingPageModule { }
