import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { PackItem } from "../../models";
import { Breakpoints } from "@angular/cdk/layout";
import { Subscription } from "rxjs";
import { LayoutService } from "../../layout.service";
import { MatDialog } from "@angular/material/dialog";
import { EditItemComponent } from "../edit-item/edit-item.component";

@Component({
  selector: 'app-item-category',
  templateUrl: './item-category.component.html',
  styleUrls: ['./item-category.component.scss']
})
export class ItemCategoryComponent implements OnInit, OnChanges, OnDestroy {
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

  constructor(private layoutService: LayoutService, public dialog: MatDialog) {}

  ngOnChanges() {
    this.items.sort((a, b) => {
      if(a.checkedAtTime && b.checkedAtTime) {
        const result = b.checkedAtTime - a.checkedAtTime;
        if (result !== 0) {
          return result;
        }
      }
      return a.description.localeCompare(b.description);
    })
  }

  checkClicked(item: PackItem, checked: boolean) {
    item.checked = checked;
    if(checked) {
      item.checkedAtTime = Date.now();
    }
    else {
      item.checkedAtTime = undefined;
    }
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

  textClicked(item: PackItem) {
    let dialogRef = this.dialog.open(EditItemComponent, {
      data: item
    });
    dialogRef.afterClosed().subscribe(result => {
      item.item.category = result.category;
      item.person = result.person;
    });
  }
}


