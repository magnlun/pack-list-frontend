import { Injectable } from '@angular/core';
import { combineLatest, Observable, of, ReplaySubject } from 'rxjs';
import { SecureHttp } from './http-client.service';
import { catchError, first, map, mergeMap, tap } from "rxjs/operators";
import { Item, PackItem, PackList, Template } from "./models";

@Injectable({
  providedIn: 'root'
})
export class PackListService {

  $packLists = new ReplaySubject<PackList[]>(1);
  $items = new ReplaySubject<Item[]>(1);
  $itemsById = new ReplaySubject<Map<number, Item>>(1);

  constructor(private http: SecureHttp) { }

  getPackList(id: number): Observable<PackList | undefined> {
    return this.$packLists.pipe(
      map((items) => items.find((item) => item.id === id)),
      mergeMap((list) => {
        if(list) {
          return of(list);
        }
        let getResponse = this.http.get<PackListResponse>(`/rest/pack-lists/${id}/`);
        return combineLatest([getResponse, this.$itemsById]).pipe(
          first(),
          map(([list, itemMap]) => this.mapPackListResponse(list, itemMap))
        );
      })
    )
  }

  deletePackList(id: number): Observable<any> {
    let $delete = this.http.delete<PackList>(`/rest/pack-lists/${id}/`);
    return combineLatest([this.$packLists, $delete]).pipe(
      first(),
      tap(([lists]) => {
        lists.splice(lists.findIndex((list) => list.id === id));
        this.$packLists.next(lists);
      })
    )
  }
  saveItemState(item: PackItem): Observable<PackItemResponse> {
    return this.http.put<PackItemResponse>(`/rest/pack-items/${item.id}/`,
      {
        id: item.id,
        checked: item.checked,
        item: item.item.id
      });
  }

  mapPackListResponse(list: PackListResponse, itemMap: Map<number, Item>): PackList {
    return {
      name: list.name,
      id: list.id,
      items: list.items.map((item) => new PackItem(item.id, itemMap.get(item.item) as Item, item.checked)),
      shareId: list.shareId
    }
  }

  getPackLists(): Observable<PackList[]> {
    let $response = this.http.get<PackListResponse[]>('/rest/pack-lists/');
    return combineLatest([$response, this.$itemsById]).pipe(
      map(([response, itemMap]) => {
        return response.map((list) => this.mapPackListResponse(list, itemMap))
      }),
      tap((lists) => this.$packLists.next(lists))
    );
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

  createPackList(packList: CreatePackListRequest): Observable<PackList> {
    const data: PackListRequest = {
      name: packList.name,
      items: packList.items.map(item => {
        return {
          checked: false,
          item: item.id
        }
      })
    };
    let $response = this.http.post<PackListResponse>('/rest/pack-lists/', data);
    return combineLatest([$response, this.$itemsById, this.$packLists]).pipe(
      first(),
      map(([response, itemMap, packLists]) => {
        const packList = this.mapPackListResponse(response, itemMap);
        packLists.push(packList);
        this.$packLists.next(packLists);
        return packList;
      }),
    );
  }

  addItemToList(packList: PackList, item: Item): Observable<PackList> {
    let $response = this.http.post<PackItemResponse>('/rest/pack-items/', {
      item: item.id,
        checked: false,
        list_id: packList.id
    });
    return combineLatest([$response, this.$itemsById, this.$packLists]).pipe(
      first(),
      map(([response, itemMap, lists]) => {
        let packItem = new PackItem(response.id, itemMap.get(response.item)!, response.checked);
        packList.items.push(packItem);
        lists.splice(lists.findIndex((list) => list.id === packList.id), 1, packList);
        this.$packLists.next(lists)
        return packList;
      })
    );
  }

  deletePackItem($event: PackItem): Observable<any> {
    return this.http.delete(`/rest/pack-items/${$event.id}`)
  }

  addPacklist(shareId: string): Observable<PackList> {
    const $response = this.http.patch<PackListResponse>(`/rest/add-to-list/${shareId}/`, {}).pipe(
      catchError((error) => {
        if(error.status === 409) {
          return of(error.error);
        }
        throw error;
      })
    );
    return combineLatest([$response, this.$itemsById, this.$packLists]).pipe(
      first(),
      map(([response, itemMap, packLists]) => {
        const packList = this.mapPackListResponse(response, itemMap);
        packLists.push(packList);
        this.$packLists.next(packLists);
        return packList;
      }),
    );
  }

  updatePackList(packList: PackList) {
    const $response = this.http.patch<PackListResponse>(`/rest/pack-lists/${packList.id}/`, {
      id: packList.id,
      name: packList.name
    });
    return combineLatest([$response, this.$itemsById, this.$packLists]).pipe(
      first(),
      map(([response, itemMap, packLists]) => {
        const packList = this.mapPackListResponse(response, itemMap);
        const packListIndex = packLists.findIndex((list) => list.id === packList.id);
        packLists[packListIndex] = packList;
        this.$packLists.next(packLists);
        return packList;
      }),
    );
  }
}

export interface CreatePackListRequest {
  name: string;
  items: Item[];
}


interface PackListRequest {
  name: string;
  items: PackItemRequest[];
}


interface PackListResponse {
  name: string;
  id: number;
  items: PackItemResponse[];
  shareId: string;
}

interface PackItemResponse {
  item: number;
  checked: boolean;
  id: number;
}

interface PackItemRequest {
  item: number;
  checked: boolean;
}
