import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormControl} from "@angular/forms";
import {startWith} from "rxjs/operators";
import {Item} from "../../models";

@Component({
  selector: 'app-item-search',
  templateUrl: './item-search.component.html',
  styleUrls: ['./item-search.component.scss']
})
export class ItemSearchComponent implements OnInit, OnChanges {

  myControl = new FormControl('');
  filteredOptions: Item[] = [];

  @Input()
  items: Item[] = [];
  @Input()
  label!: string;
  @Input()
  clearAfterSelect = true;

  @Output()
  itemSelected = new EventEmitter<Item>();
  @Output()
  itemCreated = new EventEmitter<string>();
  @Output()
  clearedInput = new EventEmitter();

  displayFn: any = (item: Item) => item.name;
  ngOnInit(): void {
    this.myControl.valueChanges.pipe(
      startWith(''),
    ).subscribe((value) => {
      this.filteredOptions = this.filter(value || '')
    })
  }

  ngOnChanges(): void {
    this.filteredOptions = this.filter(this.myControl.value || '');
  }


  private filter(value: string): Item[] {
    return this.items.filter(option => {
      if (option.name.length < value.length) {
        return false;
      }
      const compare = option.name.substring(0, value.length);
      return compare.localeCompare(value, undefined, { sensitivity: 'base' }) === 0
    });
  }

  addItem(value: Item) {
    this.itemSelected.emit(value);
    if (this.clearAfterSelect) {
      this.myControl.setValue('');
    }
  }

  selectOrCreateItem() {
    let itemName = this.myControl.value;
    if (itemName) {
      let item = this.items.find((item) => item.name === itemName);
      if (item) {
        this.addItem(item);
      } else {
        this.itemCreated.emit(itemName);
        if (this.clearAfterSelect) {
          this.myControl.setValue('');
        }
      }
    }
  }

  clearInput() {
    this.myControl.setValue('');
    this.clearedInput.emit();
  }
}
