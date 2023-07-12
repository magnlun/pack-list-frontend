import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditItemComponent } from './edit-item.component';
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { ComponentsModule } from "../../components/components.module";



@NgModule({
  declarations: [
    EditItemComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    ComponentsModule
  ]
})
export class EditItemModule { }
