import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Item, Template, TemplateItem } from "../../models";
import { combineLatest, Observable, Subscription } from "rxjs";
import { PackListService } from "../../pack-list.service";
import { TemplateService } from "../../template.service";
import { map, tap } from "rxjs/operators";

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
  @Input()
  templateItems: TemplateItem[] = [];

  @Output()
  createdTemplateItems = new EventEmitter<TemplateItem[]>();

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
    const addedItems: Set<number> = new Set<number>();
    const templateObservables: Observable<TemplateItem>[] = [];
    this.selectedItems.forEach(
      (item) => {
        if (!addedItems.has(item.id)) {
          addedItems.add(item.id);
          templateObservables.push(
            this.templateService.addTemplate(this.selectedPersons, this.selectedDestinations, this.selectedDurations, this.selectedActivities, item)
            .pipe(
              map((template) => {
                return {
                  id: template.id,
                  persons: this.selectedPersons,
                  destinations: this.selectedDestinations,
                  durations: this.selectedDurations,
                  activities: this.selectedActivities,
                  item
                }
              })
            )
          );
        }
      }
    );
    this.subscriptions.add(
      combineLatest(templateObservables)
        .pipe(
          tap((items) => {
            this.createdTemplateItems.emit(items)
          })
        )
        .subscribe()
    )
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
