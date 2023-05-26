import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PackItem, PackList } from "../../models";

@Component({
  selector: 'app-list-summary',
  templateUrl: './list-summary.component.html',
  styleUrls: ['./list-summary.component.scss']
})
export class ListSummaryComponent implements OnChanges {

  MAX_ITEMS = 5;

  @Input()
  list!: PackList;
  items: PackItem[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    let listChanges = changes['list'];
    if(listChanges) {
      this.items = listChanges.currentValue.items
      if(this.items.length > this.MAX_ITEMS) {
        this.items = this.items.slice(0, this.MAX_ITEMS);
      }
    }
  }



}
