import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from "rxjs";
import { AuthenticationService, LoginResult } from "../authentication.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  username = "";
  password = "";
  errorMessage = "";

  @Output()
  loggedIn = new EventEmitter<boolean>();

  private subscriptions = new Subscription();

  private hasEmittedLoggedin = false;

  constructor(private service: AuthenticationService) { }

  ngOnInit() {
    this.subscriptions.add(
      this.service.loggedIn$.subscribe((loggedIn) => {
        if(loggedIn && !this.hasEmittedLoggedin) {
          this.hasEmittedLoggedin = true;
          this.loggedIn.emit(true);
        }
        else {
          this.loggedIn.emit(false);
        }
      })
    )
  }

  signIn() {
    this.subscriptions.add(
      this.service.login$(this.username, this.password)
        .subscribe((result) => {
          if(!result.success) {
            this.errorMessage = result.errorMessage || "Du kunde tyvärr inte loggas in just nu, försök igen senare";
          }
        })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
