import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {merge, Observable, Subscription} from 'rxjs';
import {PackListService} from '../pack-list.service'
import {ActivatedRoute, Router} from '@angular/router';
import {map, mergeMap, startWith} from 'rxjs/operators';
import {Item, PackItem, PackList} from "../models";
import {FormControl} from "@angular/forms";
import {Breakpoints} from "@angular/cdk/layout";
import {LayoutService} from "../layout.service";
import {ItemService} from "../item.service";

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
  unselectedItems: Item[] = [];

  isSmallScreen = false;

  constructor(private service: PackListService, private route: ActivatedRoute, private router: Router, private layoutService: LayoutService, private itemService: ItemService) {
  }

  ngOnInit(): void {

    this.subscriptions.add(
      this.route.paramMap.pipe(
        mergeMap((params) => {
          const paramId = params.get('id');
          if (paramId != null) {
            return this.service.getPackList(parseInt(paramId))
          }
          return new Observable<PackList>();
        })
      ).subscribe((list) => {
        this.packList = list;
        this.unselectedItems = this.findUnselectedItems();
      })
    );
    this.subscriptions.add(
      this.layoutService.screenSize.subscribe((size) => {
        this.isSmallScreen = size === Breakpoints.XSmall || size === Breakpoints.Small
      })
    );

    this.subscriptions.add(
      this.itemService.$items.subscribe((items) => {
        this.items = items;
        this.unselectedItems = this.findUnselectedItems();
      })
    )
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private findUnselectedItems(): Item[] {
    if (this.items) {
      let packList = this.packList;
      if (packList) {
        const packedItems = packList.items;
        return this.items.filter((option) => {
          return packedItems.findIndex((packedItem) => packedItem.item.id === option.id) < 0;
        })
      }
      else {
        return this.items;
      }
    }
    return [];
  }

  sortPacklist() {
    if (this.packList) {
      this.packList.items.sort((a, b) => a.item.name.localeCompare(b.item.name));
      const unpackedItems = this.packList.items.filter((item) => !item.checked)
      this.packedItems = this.packList.items.filter((item) => item.checked)
      this.categorizedItems = unpackedItems.reduce((map, item) => {
        let items = map.get(item.category);
        if (items) {
          items.push(item)
        } else {
          map.set(item.category, [item])
        }
        return map;
      }, new Map<string | null, PackItem[]>());
      this.categoryList = [...new Set(this.packList.items.map((item) => item.category))]
        .sort((a, b) => {
            if (a === null) {
              return 1;
            }
            if (b === null) {
              return -1;
            }
            return a.localeCompare(b);
          }
        );
    }
  }

  updatePacklist(item: PackItem) {
    this.subscriptions.add(
      this.service.saveItemState(item).subscribe(() => this.sortPacklist())
    );
  }

  deleteList() {
    if (this.packList) {
      this.subscriptions.add(
        this.service.deletePackList(this.packList.id).subscribe(() => this.router.navigate(['/']))
      );
    }
  }

  shareList() {
    let shareUrl = window.location.origin + `/share/${ this.packList?.shareId }`;
    if (navigator.share) {
      navigator.share({
        title: 'Packlista ' + this.packList?.name,
        text: 'En packlista för ' + this.packList?.name,
        url: shareUrl
      })
        .then(() => console.log('Share complete'))
        .catch((error) => console.error('Could not share at this time', error))
    } else {
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
    if (this.packList) {
      this.subscriptions.add(
        this.service.addItemToList(this.packList, item).subscribe((packList) => {
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

  unselectAll() {
    let packList = this.packList;
    if (packList) {
      this.subscriptions.add(
        merge(
          packList.items
            .filter((item) => item.checked)
            .map((item) => {
              item.checked = false;
              return item;
            })
            .map((item) => this.service.saveItemState(item).subscribe())
        ).subscribe(() => this.sortPacklist())
      );
    }
  }

  cloneList() {
    if (this.packList) {
      const createRequest = {
        name: 'Kopia av ' + this.packList.name,
        items: this.packList.items.map((packItem) => {
          return {
            item: packItem.item,
            person: packItem.person
          }
        })
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

  createItem(itemName: string) {
    this.subscriptions.add(
      this.itemService.createItem(itemName).subscribe((item) => {
        this.addItem(item)
      })
    );
  }
}
