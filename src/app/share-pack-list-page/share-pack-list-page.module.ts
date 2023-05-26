import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharePackListPageComponent } from './share-pack-list-page.component';
import { LoginModule } from "../login/login.module";



@NgModule({
  declarations: [
    SharePackListPageComponent
  ],
    imports: [
        CommonModule,
        LoginModule
    ]
})
export class SharePackListPageModule { }
