import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Item, PackList, Template, TemplateItem } from "../../models";
import { Subscription } from "rxjs";
import { TemplateService } from "../../template.service";
import { LoggedInComponent } from "../../components/core";
import { Router } from "@angular/router";
import { AuthenticationService } from "../../authentication.service";
import { $e } from "codelyzer/angular/styles/chars";

@Component({
  selector: 'app-edit-template-item',
  templateUrl: './edit-template-item.component.html',
  styleUrls: ['./edit-template-item.component.scss']
})
export class EditTemplateItemComponent extends LoggedInComponent implements OnInit, OnDestroy {

  @Input()
  items!: Item[];

  displayItems: Item[] = [];

  selectedTemplateGroup: TemplateGrouping | undefined;

  templateKeys: TemplateGrouping[] = [];
  searchString: string = '';

  constructor(private templateService: TemplateService, authService: AuthenticationService, router: Router) {
    super(authService, router);
  }

  onLogin() {
    console.log("Fetching logged in items")
    this.subscriptions.add(
      this.templateService.getTemplateItems().subscribe((templateItems) => {
        const templateItemMap = templateItems
          .reduce((map, key) => {
            let templateKey = getTemplateKey(key);
            let existingKey = map.get(templateKey);
            if(existingKey) {
              existingKey.addItem(key.item, key.id);
            }
            else {
              map.set(templateKey, new TemplateGrouping(templateKey, key));
            }
            return map;
          }, new Map<string, TemplateGrouping>());
        this.templateKeys = [...templateItemMap.values()] as TemplateGrouping[];
      })
    );
  }

  selectTemplateGroup(key: TemplateGrouping) {
    this.selectedTemplateGroup = key;
  }

  updateCheckStatus(checked: boolean, item: Item) {
    if(checked) {
      const persons = this.selectedTemplateGroup!.persons;
      const destinations = this.selectedTemplateGroup!.destinations;
      const durations = this.selectedTemplateGroup!.durations;
      const activities = this.selectedTemplateGroup!.activities;
      this.subscriptions.add(
        this.templateService.addTemplate(persons, destinations, durations, activities, item).subscribe()
      );
    }
    else {
      this.subscriptions.add(
        this.templateService.deleteTemplate(this.selectedTemplateGroup?.idMapping.get(item)!).subscribe()
      );
    }
  }
}

class TemplateGrouping {

  persons: Template[];
  destinations: Template[];
  durations: Template[];
  activities: Template[];
  items: Item[] = [];
  description: string;
  idMapping: Map<Item, number> = new Map<Item, number>();

  constructor(private id: string, item: TemplateItem) {
    this.persons = item.persons || [];
    this.destinations = item.destinations || [];
    this.durations = item.durations || [];
    this.activities = item.activities || [];
    this.addItem(item.item, item.id);
    this.description = stringifyTemplateItem(this);
  }

  addItem(item: Item, id: number) {
    if (this.items.findIndex((exitingItem) => exitingItem.id === item.id) < 0) {
      this.items.push(item);
      this.idMapping.set(item, id);
    }
  }
}

function getTemplateKey(templateItem: TemplateItem): string {
  let personIdList = (templateItem.persons || []).map((person) => person.id).join(",");
  let destinationIdList = (templateItem.destinations || []).map((destination) => destination.id).join(",");
  let durationIdList = (templateItem.durations || []).map((duration) => duration.id).join(",");
  let activityIdList = (templateItem.activities || []).map((activity) => activity.id).join(",");
  return personIdList + '|' + destinationIdList + '|' + durationIdList + '|' + activityIdList;
}

function stringifyTemplateItem(key: TemplateGrouping): string {
  if (!key.persons.length && !key.destinations.length && !key.durations.length && !key.activities.length) {
    return "Alltid";
  }
  const names = key.persons.map((person) => person.name);
  const destinations = key.destinations.map((person) => person.name);
  const durations = key.durations.map((person) => person.name);
  const activities = key.activities.map((person) => person.name);
  return [...names, ...destinations, ...durations, ...activities].join(", ")
}
