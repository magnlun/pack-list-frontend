import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from "rxjs";
import { AuthenticationService } from "../authentication.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, OnDestroy {

  loggedIn = false;

  constructor(private authService: AuthenticationService, private router: Router) {
  }

  private subscriptions = new Subscription();
  ngOnInit(): void {
    this.subscriptions.add(
      this.authService.loggedIn$.subscribe((loggedIn) => this.loggedIn = loggedIn)
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  logout() {
    this.authService.logout();
  }

}
