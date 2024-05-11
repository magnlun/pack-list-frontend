import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Item } from "../../models";
import { TemplateService } from "../../template.service";
import { Subscription } from "rxjs";
import { PackListService } from "../../pack-list.service";
import { ItemService } from "../../item.service";

@Component({
  selector: 'app-filterable-item-list',
  templateUrl: './filterable-item-list.component.html',
  styleUrls: ['./filterable-item-list.component.scss']
})
export class FilterableItemListComponent implements OnInit, OnChanges, OnDestroy {

  items: Item[] = [];
  @Input()
  selectedItems: Item[] = [];
  @Input()
  disabled = false;

  @Output()
  updateSelectStatus = new EventEmitter<[Item, boolean]>();
  displayItems: Item[] = [];
  searchString = '';
  private subscriptions = new Subscription();


  constructor(private itemService: ItemService) {
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.itemService.$items.subscribe((items) => {
        this.items = items;
        this.updateSearch(this.searchString);
        this.sortItemList();
      })
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    this.sortItemList();
  }

  updateSearch($event: string) {
    this.searchString = $event;
    this.displayItems = this.items.filter((item) => item.name.toLowerCase().includes(this.searchString.toLowerCase()));
    this.sortItemList();
  }

  isSelected(item: Item) {
    return this.selectedItems.findIndex((selectedItem) => selectedItem.id === item.id) >= 0;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  updateCheckStatus(newSelected: Item) {
    let index = this.selectedItems.indexOf(newSelected);
    if (index >= 0) {
      this.updateSelectStatus.emit([newSelected, false]);
    }
    else {
      this.updateSelectStatus.emit([newSelected, true]);
    }
    this.sortItemList();
  }

  sortItemList() {
    this.displayItems.sort((a, b) => {
      let aIsSelected = this.selectedItems.findIndex((item) => item.id === a.id) >= 0;
      let bIsSelected = this.selectedItems.findIndex((item) => item.id === b.id) >= 0;
      if (aIsSelected && !bIsSelected) {
        return -1;
      }
      if (bIsSelected && !aIsSelected) {
        return 1;
      }
      return a.name.localeCompare(b.name);
    })
  }
}
