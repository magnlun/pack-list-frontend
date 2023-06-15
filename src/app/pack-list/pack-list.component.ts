import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { PackListService } from '../pack-list.service'
import { ActivatedRoute, Router } from '@angular/router';
import { map, mergeMap, startWith } from 'rxjs/operators';
import { Item, PackItem, PackList } from "../models";
import { FormControl } from "@angular/forms";
import { Breakpoints } from "@angular/cdk/layout";
import { LayoutService } from "../layout.service";

@Component({
  selector: 'app-pack-list',
  templateUrl: './pack-list.component.html',
  styleUrls: ['./pack-list.component.scss']
})
export class PackListComponent implements OnInit, OnDestroy {
  _packList: PackList | undefined;

  categoryList: (string | null)[] = [];
  packedItems: PackItem[] = [];
  categorizedItems: Map<string | null, PackItem[]> = new Map();
  editTeamName: boolean = false;
  private subscriptions = new Subscription();
  items: Item[] = [];

  myControl = new FormControl('');
  filteredOptions!: Observable<Item[]>;

  isSmallScreen = false;

  displayFn: any = (item: Item) => item.name;

  constructor(private service: PackListService, private route: ActivatedRoute, private router: Router, private layoutService: LayoutService) { }

  ngOnInit(): void {

    this.subscriptions.add(
      this.route.paramMap.pipe(
        mergeMap((params) => {
          const paramId = params.get('id');
          if(paramId != null) {
            return this.service.getPackList(parseInt(paramId))
          }
          return new Observable<PackList>();
        })
      ).subscribe((list) => {
        if(list) {
          this.categoryList = [...new Set(list.items.map((item) => item.category))]
          this.packList = list;
        }
      })
    );
    this.subscriptions.add(
      this.layoutService.screenSize.subscribe((size) => {
        this.isSmallScreen = size === Breakpoints.XSmall || size === Breakpoints.Small
      })
    );

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
    this.subscriptions.add(
      this.service.$items.subscribe((items) => this.items = items)
    )
  }


  private _filter(value: string): Item[] {
    return this.items.filter((option) => {
      if(this.packList) {
        return this.packList.items.findIndex((packedItem) => packedItem.item.id === option.id) < 0;
      }
      return true;
    }).filter(option => {
      if(option.name.length < value.length) {
        return false;
      }
      const compare = option.name.substring(0, value.length);
      return compare.localeCompare(value, undefined, { sensitivity: 'base' }) === 0
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  sortPacklist() {
    if(this.packList) {
      this.packList.items.sort((a, b) => a.item.name.localeCompare(b.item.name));
      const unpackedItems = this.packList.items.filter((item) => !item.checked)
      this.packedItems = this.packList.items.filter((item) => item.checked)
      this.categorizedItems = unpackedItems.reduce((map, item) => {
        let items = map.get(item.category);
        if(items) {
          items.push(item)
        }
        else {
          map.set(item.category, [item])
        }
        return map;
      }, new Map<string | null, PackItem[]>());
      this.categoryList = [...new Set(this.packList.items.map((item) => item.category))].sort((a, b) => {
        if(a === null) {
          return -1;
        }
        if(b === null) {
          return 1;
        }
        return a.localeCompare(b);
      });
    }
  }

  updatePacklist(item: PackItem) {
    this.subscriptions.add(
      this.service.saveItemState(item).subscribe(() => this.sortPacklist())
    );
  }

  deleteList() {
    if(this.packList) {
      this.subscriptions.add(
        this.service.deletePackList(this.packList.id).subscribe(() => this.router.navigate(['/']))
      );
    }
  }

  shareList() {
    let shareUrl = window.location.origin + `/share/${this.packList?.shareId}`;
    if(navigator.share) {
      navigator.share({
        title: 'Packlista ' + this.packList?.name,
        text: 'En packlista för ' + this.packList?.name,
        url: shareUrl
      })
        .then(() => console.log('Share complete'))
        .catch((error) => console.error('Could not share at this time', error))
    }
    else {
      navigator.clipboard.writeText(shareUrl);
    }
  }

  startEdit() {
    this.editTeamName = true;
  }

  get packList(): PackList | undefined {
    return this._packList;
  }

  set packList(packList: PackList | undefined) {
    this._packList = packList;
    this.sortPacklist();
  }

  addItem(item: Item) {
    if(this.packList) {
      this.subscriptions.add(
        this.service.addItemToList(this.packList, item).subscribe((packList) => {
          this.myControl.setValue('');
          this.packList = packList;
        })
      );
    }
  }

  deleteItem(deletedEvent: PackItem) {
    this.subscriptions.add(
      this.service.deletePackItem(deletedEvent).subscribe(() => {
        this.packList!.items.splice(this.packList!.items.findIndex((item) => item.id === deletedEvent.id), 1)
        this.sortPacklist();
      })
    );
  }

  cloneList() {
    if(this.packList) {
      const createRequest = {
        name: this.packList.name,
        items: this.packList.items.map((packItem) => packItem.item)
      };
      this.subscriptions.add(
        this.service.createPackList(createRequest).subscribe((newList) => this.router.navigate(['/list', newList.id]))
      )
    }
  }

  saveName() {
    this.editTeamName = false;
    this.subscriptions.add(
      this.service.updatePackList(this.packList!).subscribe()
    );
  }

  selectOrCreateItem() {
    let itemName = this.myControl.value;
    if(itemName) {
      let item = this.items.find((item) => item.name === itemName);
      if(item) {
        this.addItem(item);
      }
      else {
        this.subscriptions.add(
          this.service.createItem(itemName).subscribe((item) => {
            this.addItem(item)
          })
        );
      }
    }
  }
}
