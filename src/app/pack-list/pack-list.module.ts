import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PackListComponent } from './pack-list.component';
import { HttpClientModule } from '@angular/common/http';
import { ItemCategoryComponent } from './item-category/item-category.component';
import { ComponentsModule } from "../components/components.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatInputModule } from "@angular/material/input";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatExpansionModule } from "@angular/material/expansion";


@NgModule({
  declarations: [PackListComponent, ItemCategoryComponent],
  exports: [
    PackListComponent
  ],
    imports: [
        CommonModule,
        HttpClientModule,
        ComponentsModule,
        ReactiveFormsModule,
        FormsModule,
        MatAutocompleteModule,
        MatInputModule,
        MatTooltipModule,
        MatButtonModule,
        MatIconModule,
        MatExpansionModule
    ]
})
export class PackListModule { }
