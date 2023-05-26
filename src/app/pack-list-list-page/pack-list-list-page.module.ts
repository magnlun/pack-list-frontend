import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PackListListPageComponent } from './pack-list-list-page.component';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { ComponentsModule } from "../components/components.module";
import { ListSummaryComponent } from './list-summary/list-summary.component';
import { MatCardModule } from "@angular/material/card";


@NgModule({
  declarations: [PackListListPageComponent, ListSummaryComponent],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule,
    ComponentsModule,
    MatCardModule
  ]
})
export class PackListListPageModule { }
