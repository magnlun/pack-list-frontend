import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from "rxjs";
import { AuthenticationService } from "../authentication.service";

@Component({
  selector: 'app-forgot-password-page',
  templateUrl: './forgot-password-page.component.html',
  styleUrls: ['./forgot-password-page.component.scss']
})
export class ForgotPasswordPageComponent implements OnDestroy {
  email: string = '';
  requested = false;

  private subscriptions = new Subscription();

  constructor(private service: AuthenticationService) {
  }

  reset() {
    this.subscriptions.add(
      this.service.requestPasswordReset(this.email).subscribe(() => this.requested = true)
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
