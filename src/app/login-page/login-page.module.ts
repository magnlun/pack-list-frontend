import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginPageComponent } from './login-page.component';
import { FormsModule } from '@angular/forms';
import { ComponentsModule } from "../components/components.module";
import { MatButtonModule } from "@angular/material/button";
import { LoginModule } from "../login/login.module";


@NgModule({
  declarations: [LoginPageComponent],
    imports: [
        CommonModule,
        FormsModule,
        ComponentsModule,
        MatButtonModule,
        LoginModule
    ]
})
export class LoginPageModule { }
