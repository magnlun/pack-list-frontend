import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Item, Template, TemplateItem } from "../models";
import { Subscription } from "rxjs";
import { AuthenticationService } from "../authentication.service";
import { PackListService } from '../pack-list.service';
import { Router } from "@angular/router";
import { MatSelectionListChange } from "@angular/material/list";
import { TemplateService } from "../template.service";
import { LoggedInComponent } from "../components/core";
import { ItemService } from "../item.service";

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
  templateItems: TemplateItem[] = [];

  constructor(authService: AuthenticationService, private packService: PackListService, router: Router, private templateService: TemplateService, private itemService: ItemService) {
    super(authService, router);
  }


  onLogin(): void {
    this.subscriptions.add(
      this.itemService.$items.subscribe((items) => {
        this.items = items;
        this.items.sort((a, b) => a.name.localeCompare(b.name))
      })
    );
    this.subscriptions.add(
      this.templateService.$persons.subscribe((persons) => this.persons = persons)
    );
    this.subscriptions.add(
      this.templateService.$durations.subscribe((durations) => this.durations = durations)
    );
    this.subscriptions.add(
      this.templateService.$destinations.subscribe((destinations) => this.destinations = destinations)
    );
    this.subscriptions.add(
      this.templateService.$activities.subscribe((activities) => this.activities = activities)
    );
    this.subscriptions.add(
      this.templateService.getTemplateItems().subscribe((items) => this.templateItems = items)
    );
  }

  createdTemplateItems(items: TemplateItem[]) {
    const newItems = [...this.templateItems];
    items.forEach((item) => {
      newItems.push(item)
    });
    this.templateItems = newItems;
  }
}
