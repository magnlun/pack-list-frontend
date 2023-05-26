import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreatePackListComponent } from './create-pack-list/create-pack-list.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { PackListListPageComponent } from './pack-list-list-page/pack-list-list-page.component';
import { PackListComponent } from './pack-list/pack-list.component';
import { TemplateItemPageComponent } from "./template-item-page/template-item-page.component";
import { TemplatePageComponent } from "./template-page/template-page.component";
import { SharePackListPageComponent } from "./share-pack-list-page/share-pack-list-page.component";

const routes: Routes = [
  { path: '', component: PackListListPageComponent },
  { path: 'list/:id', component: PackListComponent },
  { path: 'createList', component: CreatePackListComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'templateItem', component: TemplateItemPageComponent },
  { path: 'template', component: TemplatePageComponent },
  { path: 'share/:id', component: SharePackListPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
