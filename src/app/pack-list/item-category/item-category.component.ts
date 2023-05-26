import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { PackItem } from "../../models";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { takeUntil } from "rxjs/operators";
import { Subject, Subscription } from "rxjs";
import { LayoutService } from "../../layout.service";

@Component({
  selector: 'app-item-category',
  templateUrl: './item-category.component.html',
  styleUrls: ['./item-category.component.scss']
})
export class ItemCategoryComponent implements OnInit, OnDestroy {
  @Input()
  name: string | null | undefined;

  @Input()
  items: PackItem[] = [];

  @Output()
  updateEvent = new EventEmitter<PackItem>();

  @Output()
  deleteEvent = new EventEmitter<PackItem>();
  isSmallScreen = false;

  subscriptions = new Subscription();

  constructor(private layoutService: LayoutService) {
  }

  checkClicked(item: PackItem, checked: boolean) {
    item.checked = checked;
    this.updateEvent.emit(item);
  }

  deleteItem(item: PackItem) {
    this.deleteEvent.emit(item)
  }

  ngOnInit() {
    this.subscriptions.add(
      this.layoutService.screenSize.subscribe((size) => {
        this.isSmallScreen = size === Breakpoints.XSmall || size === Breakpoints.Small
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}


