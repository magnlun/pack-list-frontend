import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from "rxjs";
import { AuthenticationService } from "../authentication.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-reset-password-page',
  templateUrl: './reset-password-page.component.html',
  styleUrls: ['./reset-password-page.component.scss']
})
export class ResetPasswordPageComponent implements OnInit, OnDestroy {

  password: string = '';
  confirmPassword: string = '';
  token: string = '';
  errorMessage: string | undefined;

  private subscriptions = new Subscription();

  constructor(private service: AuthenticationService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {

    this.subscriptions.add(
      this.route.paramMap.subscribe(params => {
        const paramId = params.get('token');
        if(paramId) {
          this.token = paramId;
        }
      })
    );
  }

  setPassword() {
    if(this.password !== this.confirmPassword) {
      this.errorMessage = "Löseordet matchar inte";
      return;
    }
    this.subscriptions.add(
      this.service.setPassword(this.token, this.password).subscribe(() => this.router.navigate(['/login']))
    )
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
