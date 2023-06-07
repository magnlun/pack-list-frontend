import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { PackListModule } from './pack-list/pack-list.module';
import { LoginPageModule } from './login-page/login-page.module';
import { AuthInterceptor } from './auth-interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { PackListListPageModule } from './pack-list-list-page/pack-list-list-page.module';
import { CreatePackListModule } from './create-pack-list/create-pack-list.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MenuModule } from "./menu/menu.module";
import { TemplateItemPageModule } from "./template-item-page/template-item-page.module";
import { TemplatePageModule } from "./template-page/template-page.module";
import { SharePackListPageModule } from "./share-pack-list-page/share-pack-list-page.module";
import { RegisterPageModule } from "./register-page/register-page.module";
import { ForgotPasswordPageModule } from "./forgot-password-page/forgot-password-page.module";
import { ResetPasswordPageModule } from "./reset-password-page/reset-password-page.module";

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    PackListModule,
    LoginPageModule,
    PackListListPageModule,
    CreatePackListModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MenuModule,
    TemplateItemPageModule,
    TemplatePageModule,
    SharePackListPageModule,
    RegisterPageModule,
    ForgotPasswordPageModule,
    ResetPasswordPageModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
