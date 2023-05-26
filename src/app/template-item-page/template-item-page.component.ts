import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Item, Template } from "../models";
import { Subscription } from "rxjs";
import { AuthenticationService } from "../authentication.service";
import { PackListService } from '../pack-list.service';
import { Router } from "@angular/router";
import { MatSelectionListChange } from "@angular/material/list";
import { TemplateService } from "../template.service";
import { LoggedInComponent } from "../components/core";

@Component({
  selector: 'app-template-item-page',
  templateUrl: './template-item-page.component.html',
  styleUrls: ['./template-item-page.component.scss']
})
export class TemplateItemPageComponent extends LoggedInComponent {

  items: Item[] = [];
  persons: Template[] = [];
  destinations: Template[] = [];
  activities: Template[] = [];
  durations: Template[] = [];

  constructor(authService: AuthenticationService, private packService: PackListService, router: Router, private templateService: TemplateService) {
    super(authService, router);
  }


  onLogin(): void {
    this.subscriptions.add(
      this.packService.$items.subscribe((items) => {
        this.items = items;
        this.items.sort((a, b) => a.name.localeCompare(b.name))
      })
    );
    this.subscriptions.add(
      this.templateService.getPersons().subscribe((persons) => this.persons = persons)
    );
    this.subscriptions.add(
      this.templateService.getDurations().subscribe((durations) => this.durations = durations)
    );
    this.subscriptions.add(
      this.templateService.getDestinations().subscribe((destinations) => this.destinations = destinations)
    );
    this.subscriptions.add(
      this.templateService.getActivities().subscribe((activities) => this.activities = activities)
    );
  }
}
