import { Directive, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthenticationService } from "../authentication.service";
import { Router } from "@angular/router";

@Directive()
export abstract class LoggedInComponent implements OnInit, OnDestroy {

  protected subscriptions = new Subscription();

  protected constructor(private authService: AuthenticationService, private router: Router) {
  }
  ngOnInit(): void {
    this.subscriptions.add(
      this.authService.loggedIn$.subscribe((loggedIn) => {
        if(loggedIn) {
          this.onLogin();
        }
        else {
          this.router.navigate(['/login'])
        }
      })
    )
  }

  abstract onLogin(): void;

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
