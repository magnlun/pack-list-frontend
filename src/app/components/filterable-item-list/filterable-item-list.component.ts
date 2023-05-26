import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Item } from "../../models";
import { TemplateService } from "../../template.service";
import { Subscription } from "rxjs";
import { PackListService } from "../../pack-list.service";

@Component({
  selector: 'app-filterable-item-list',
  templateUrl: './filterable-item-list.component.html',
  styleUrls: ['./filterable-item-list.component.scss']
})
export class FilterableItemListComponent implements OnInit, OnDestroy {

  items: Item[] = [];
  @Input()
  selectedItems: Item[] = [];
  @Output()
  updateSelectStatus = new EventEmitter<[Item, boolean]>();
  displayItems: Item[] = [];
  searchString = '';
  private subscriptions = new Subscription();


  constructor(private templateService: TemplateService, private packListService: PackListService) {
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.packListService.getItems().subscribe((items) => {
        this.items = items;
        this.updateSearch(this.searchString);
      })
    );
  }

  updateSearch($event: string) {
    this.searchString = $event;
    this.displayItems = this.items.filter((item) => item.name.includes(this.searchString));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  updateCheckStatus(newSelected: Item[]) {
    const newSelectedSet = new Set<Item>(newSelected);
    const selectedSet = new Set<Item>(this.selectedItems);
    this.selectedItems
      .filter((item) => !newSelectedSet.has(item))
      .forEach((item) => this.updateSelectStatus.emit([item, false]));
    newSelected
      .filter((item) => !selectedSet.has(item))
      .forEach((item) => this.updateSelectStatus.emit([item, true]));
    this.selectedItems = newSelected
  }
}
