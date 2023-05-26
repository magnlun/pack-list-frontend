import { Component, OnDestroy } from '@angular/core';
import { Subscription } from "rxjs";
import { TemplateService } from "../template.service";
import { LoggedInComponent } from "../components/core";
import { AuthenticationService } from "../authentication.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-template-page',
  templateUrl: './template-page.component.html',
  styleUrls: ['./template-page.component.scss']
})
export class TemplatePageComponent extends LoggedInComponent {

  personName: string = '';

  constructor(private templateService: TemplateService, authService: AuthenticationService, router: Router ) {
    super(authService, router);
  }
  onLogin(): void {}
  createPerson(name: string) {
    this.subscriptions.add(
      this.templateService.createPerson({name: name}).subscribe(() => this.personName = '')
    );
  }

  createDestination(name: string) {
    this.subscriptions.add(
      this.templateService.createDestination({name: name}).subscribe(() => this.personName = '')
    );
  }

  createDuration(name: string) {
    this.subscriptions.add(
      this.templateService.createDuration({name: name}).subscribe(() => this.personName = '')
    );
  }

  createActivity(name: string) {
    this.subscriptions.add(
      this.templateService.createActivity({name: name}).subscribe(() => this.personName = '')
    );
  }
}
