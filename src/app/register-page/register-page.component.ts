import { Component, OnDestroy } from '@angular/core';
import { Subscription } from "rxjs";
import { AuthenticationService } from "../authentication.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnDestroy {
  email = '';
  password = '';
  confirmPassword = '';

  private subscriptions = new Subscription();

  constructor(private authService: AuthenticationService, private router: Router) {
  }

  register() {
    if(this.password !== this.confirmPassword) {
      return;
    }
    this.subscriptions.add(
      this.authService.registerUser(this.email, this.password).subscribe(() => this.router.navigate(['/']))
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
