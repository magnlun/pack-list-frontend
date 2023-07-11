import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { Subscription } from 'rxjs';
import { PackListService } from "../pack-list.service";
import { Router } from "@angular/router";
import { distinctUntilChanged, mergeMap } from "rxjs/operators";
import { RadioButtonData } from "../components/radio-button-group/radio-button-group.component";
import { TemplateService } from "../template.service";
import { LoggedInComponent } from "../components/core";

@Component({
  selector: 'app-create-pack-list',
  templateUrl: './create-pack-list.component.html',
  styleUrls: ['./create-pack-list.component.scss']
})
export class CreatePackListComponent extends LoggedInComponent {

  persons: RadioButtonData[] = [];
  destinations: RadioButtonData[] = [];
  activities: RadioButtonData[] = [];
  durations: RadioButtonData[] = [];

  selectedPersons: RadioButtonData[] = [];
  selectedDestinations: RadioButtonData[] = [];
  selectedActivities: RadioButtonData[] = [];
  selectedDuration: RadioButtonData | undefined;
  name = '';
  emptyNameError = false;
  durationErrorMessage: string | undefined;

  constructor(authService: AuthenticationService, private packListService: PackListService, private templateService: TemplateService, router: Router) {
    super(authService, router);
  }

  onLogin(): void {
    console.log("Fetching create pack list items")
    this.subscriptions.add(
      this.templateService.$persons.subscribe((persons) => {
        this.persons = persons.map((duration) => {
          return {
            label: duration.name,
            data: duration
          }
        });
      })
    );
    this.subscriptions.add(
      this.templateService.$durations.subscribe((durations) => {
        this.durations = durations.map((duration) => {
          return {
            label: duration.name,
            data: duration
          }
        });
        this.selectedDuration = this.durations[0];
      })
    );
    this.subscriptions.add(
      this.templateService.$destinations.subscribe((destinations) => {
        this.destinations = destinations.map((duration) => {
          return {
            label: duration.name,
            data: duration
          }
        });
      })
    );
    this.subscriptions.add(
      this.templateService.$activities.subscribe((activities) => {
        this.activities = activities.map((activity) => {
          return {
            label: activity.name,
            data: activity
          }
        });
      })
    );
  }

  submit() {
    if(!this.selectedDuration) {
      this.durationErrorMessage = 'Du måste välja en längd';
    }
    if(!this.name.length) {
      this.emptyNameError = true;
    }
    if(!this.selectedDuration || !this.name.length) {
      return;
    }
    this.subscriptions.add(
      this.templateService.getItemsFromTemplates(this.selectedPersons.map((elem) => elem.data),
        this.selectedDestinations.map((elem) => elem.data),
        this.selectedActivities.map((elem) => elem.data),
        this.selectedDuration.data).pipe(
          mergeMap((items) => {
            return this.packListService.createPackList({
              name: this.name,
              items: items
            })
          })
      ).subscribe((packList) => this.router.navigate(['/list', packList.id]))
    );
  }

  nameUpdate($event: string) {
    this.name = $event;
    this.emptyNameError = !this.name;
  }

  selectDuration(duration: RadioButtonData) {
    this.durationErrorMessage = undefined;
    this.selectedDuration = duration;
  }
}
