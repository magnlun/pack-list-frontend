import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {Item} from "../../models";
import {MatAutocompleteTrigger} from "@angular/material/autocomplete";

@Component({
  selector: 'app-item-search',
  templateUrl: './item-search.component.html',
  styleUrls: ['./item-search.component.scss']
})
export class ItemSearchComponent implements OnInit, OnChanges {

  _filterText = '';
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
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger!: MatAutocompleteTrigger;

  displayFn: any = (item: Item) => {
    if (!item) {
      return '';
    }
    return item.name;
  }

  ngOnInit(): void {
    this.filteredOptions = this.filter('');
  }

  set filterText(text: string) {
    if (text !== this._filterText) {
      this._filterText = text;
      this.filteredOptions = this.filter(text);
    }
  }

  get filterText(): string {
    return this._filterText;
  }

  ngOnChanges(): void {
    this.filteredOptions = this.filter(this.filterText);
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
      this.filterText = '';
    }
  }

  selectOrCreateItem() {
    let item = this.items.find((item) => item.name.localeCompare(this.filterText, undefined, { sensitivity: 'base' }) === 0);
    if (item) {
      this._filterText = item.name;
      this.addItem(item);
      this.autocompleteTrigger.closePanel();
    } else {
      this.itemCreated.emit(this.filterText);
      if (this.clearAfterSelect) {
        this.filterText = '';
      }
    }
  }

  clearInput() {
    this.filterText = '';
    this.clearedInput.emit();
  }
}
