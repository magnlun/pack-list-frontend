import { Component, Input, OnDestroy } from '@angular/core';
import { Item, Template } from "../../models";
import { Subscription } from "rxjs";
import { PackListService } from "../../pack-list.service";
import { TemplateService } from "../../template.service";

@Component({
  selector: 'app-new-template-item',
  templateUrl: './new-template-item.component.html',
  styleUrls: ['./new-template-item.component.scss']
})
export class NewTemplateItemComponent implements OnDestroy {

  private subscriptions = new Subscription();


  @Input()
  items: Item[] = [];
  @Input()
  persons: Template[] = [];
  @Input()
  destinations: Template[] = [];
  @Input()
  activities: Template[] = [];
  @Input()
  durations: Template[] = [];

  selectedPersons: Template[] = [];
  selectedDestinations: Template[] = [];
  selectedActivities: Template[] = [];
  selectedDurations: Template[] = [];
  selectedItems: Item[] = [];

  constructor(private templateService: TemplateService) {
  }

  get personDescription(): string {
    const stringPersons = this.selectedPersons.map((person) => person.name);
    if(!stringPersons.length) {
      return 'någon';
    }
    if(stringPersons.length === 1) {
      return stringPersons[0];
    }
    return stringPersons.slice(0, stringPersons.length - 1).join(', ') + " eller " + stringPersons[stringPersons.length - 1];
  }

  get destinationDescription(): string {
    const stringPersons = this.selectedDestinations.map((person) => person.name);
    if(!stringPersons.length) {
      return 'någonstans';
    }
    if(stringPersons.length === 1) {
      return "till " + stringPersons[0];
    }
    return "till " + stringPersons.slice(0, stringPersons.length - 1).join(', ') + " eller " + stringPersons[stringPersons.length - 1];
  }

  get itemDescription(): string {
    const stringPersons = this.selectedItems.map((person) => person.name.toLowerCase());
    if(!stringPersons.length) {
      return 'inget';
    }
    if(stringPersons.length === 1) {
      return stringPersons[0];
    }
    return stringPersons.slice(0, stringPersons.length - 1).join(', ') + " och " + stringPersons[stringPersons.length - 1];
  }

  get durationDescription(): string {
    const stringPersons = this.selectedDurations.map((person) => person.name.toLowerCase());
    if(!stringPersons.length) {
      return '';
    }
    if(stringPersons.length === 1) {
      return 'i ' + stringPersons[0];
    }
    return 'i ' + stringPersons.slice(0, stringPersons.length - 1).join(', ') + " eller " + stringPersons[stringPersons.length - 1];
  }

  get activityDescription(): string {
    const stringPersons = this.selectedActivities.map((person) => person.name.toLowerCase());
    if(!stringPersons.length) {
      return 'någonting';
    }
    if(stringPersons.length === 1) {
      return stringPersons[0];
    }
    return stringPersons.slice(0, stringPersons.length - 1).join(', ') + " eller " + stringPersons[stringPersons.length - 1];
  }

  submit() {
    this.selectedItems.forEach(
      (item) => {
        this.subscriptions.add(
          this.templateService.addTemplate(this.selectedPersons, this.selectedDestinations, this.selectedDurations, this.selectedActivities, item).subscribe()
        )
      }
    );
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  updateSelectedItems(item: Item, selected: boolean) {
    if(selected) {
      this.selectedItems.push(item);
    }
    else {
      this.selectedItems.splice(this.selectedItems.findIndex((elem) => elem.id === item.id), 1)
    }
  }
}
