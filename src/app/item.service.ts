import { Injectable } from '@angular/core';
import { combineLatest, Observable, ReplaySubject } from "rxjs";
import { Item } from "./models";
import { SecureHttp } from "./http-client.service";
import { first, map, tap } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  $items = new ReplaySubject<Item[]>(1);
  $itemsById = new ReplaySubject<Map<number, Item>>(1);

  constructor(private http: SecureHttp) { }

  createItem(name: string): Observable<Item> {
    let newItem = this.http.post<Item>('/rest/items/', {name: name.trim()});
    return combineLatest([newItem, this.$items]).pipe(
      first(),
      map(([item, existingItems]) => {
        let items = existingItems.concat([item]);
        this.$items.next(items);
        this.$itemsById.next(
          items.reduce((map, item) => {
            map.set(item.id, item);
            return map;
          }, new Map<number, Item>())
        )
        return item
      })
    )
  }

  getItems(): Observable<Item[]> {
    return this.http.get<Item[]>('/rest/items/').pipe(
      tap((items) => {
        this.$items.next(items);
        this.$itemsById.next(
          items.reduce((map, item) => {
            map.set(item.id, item);
            return map;
          }, new Map<number, Item>())
        )
      })
    );
  }
}
