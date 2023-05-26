import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreatePackListComponent } from './create-pack-list.component';
import { FormsModule } from '@angular/forms';
import { ComponentsModule } from "../components/components.module";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";


@NgModule({
  declarations: [CreatePackListComponent],
  imports: [
    CommonModule,
    FormsModule,
    ComponentsModule,
    MatButtonModule,
    MatInputModule
  ]
})
export class CreatePackListModule { }
