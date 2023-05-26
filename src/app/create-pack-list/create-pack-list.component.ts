import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { Subscription } from 'rxjs';
import { PackListService } from "../pack-list.service";
import { Router } from "@angular/router";
import { mergeMap } from "rxjs/operators";
import { RadioButtonData } from "../components/radio-button-group/radio-button-group.component";
import { TemplateService } from "../template.service";

@Component({
  selector: 'app-create-pack-list',
  templateUrl: './create-pack-list.component.html',
  styleUrls: ['./create-pack-list.component.scss']
})
export class CreatePackListComponent implements OnInit, OnDestroy {

  private subscriptions = new Subscription();

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

  constructor(private authService: AuthenticationService, private packListService: PackListService, private templateService: TemplateService, private router: Router) { }

  ngOnInit(): void {
    this.subscriptions.add(
      this.authService.loggedIn$.subscribe((loggedIn) => {
        if(!loggedIn) {
          this.router.navigate(["/login"]);
        }
        else {
          this.subscriptions.add(
            this.templateService.getPersons().subscribe((persons) => {
              this.persons = persons.map((duration) => {
                return {
                  label: duration.name,
                  data: duration
                }
              });
            })
          );
          this.subscriptions.add(
            this.templateService.getDurations().subscribe((durations) => {
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
            this.templateService.getDestinations().subscribe((destinations) => {
              this.destinations = destinations.map((duration) => {
                return {
                  label: duration.name,
                  data: duration
                }
              });
            })
          );
          this.subscriptions.add(
            this.templateService.getActivities().subscribe((activities) => {
              this.activities = activities.map((activity) => {
                return {
                  label: activity.name,
                  data: activity
                }
              });
            })
          );
        }
      })
    )
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
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
