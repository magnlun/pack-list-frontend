import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplateItemPageComponent } from './template-item-page.component';
import { MatListModule } from "@angular/material/list";
import { MatSelectModule } from "@angular/material/select";
import { ComponentsModule } from "../components/components.module";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatTabsModule } from "@angular/material/tabs";
import { NewTemplateItemComponent } from './new-template-item/new-template-item.component';
import { EditTemplateItemComponent } from './edit-template-item/edit-template-item.component';
import {ItemSearchModule} from "../components/item-search/item-search.module";



@NgModule({
  declarations: [
    TemplateItemPageComponent,
    NewTemplateItemComponent,
    EditTemplateItemComponent
  ],
    imports: [
        CommonModule,
        BrowserModule,
        RouterModule,
        MatListModule,
        MatSelectModule,
        ComponentsModule,
        FormsModule,
        MatCardModule,
        MatButtonModule,
        MatTabsModule,
        ItemSearchModule
    ]
})
export class TemplateItemPageModule { }
