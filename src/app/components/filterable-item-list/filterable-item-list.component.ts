import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
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
export class FilterableItemListComponent implements OnInit, OnDestroy {

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


  constructor(private templateService: TemplateService, private packListService: PackListService, private itemService: ItemService) {
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.itemService.$items.subscribe((items) => {
        this.items = items;
        this.updateSearch(this.searchString);
      })
    );
  }

  updateSearch($event: string) {
    this.searchString = $event;
    this.displayItems = this.items.filter((item) => item.name.toLowerCase().includes(this.searchString.toLowerCase()));
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
      this.selectedItems.splice(index, 1);
      this.updateSelectStatus.emit([newSelected, false]);
    }
    else {
      this.selectedItems.push(newSelected);
      this.updateSelectStatus.emit([newSelected, true]);
    }
  }
}
