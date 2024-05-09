import {Injectable} from '@angular/core';
import {combineLatest, Observable, of, ReplaySubject} from 'rxjs';
import {SecureHttp} from './http-client.service';
import {catchError, first, map, mergeMap, tap} from "rxjs/operators";
import {Item, PackItem, PackList, Template, TemplateItem} from "./models";
import {TemplateService} from "./template.service";
import {ItemService} from "./item.service";

@Injectable({
  providedIn: 'root'
})
export class PackListService {

  $packLists = new ReplaySubject<PackList[]>(1);

  constructor(private http: SecureHttp, private templateService: TemplateService, private itemService: ItemService) {
  }

  getPackList(id: number): Observable<PackList> {
    let $persons = this.templateService.$persons
      .pipe(
        map((persons) => new Map<number, Template>(persons.map((person) => [person.id, person])))
      );
    return this.$packLists.pipe(
      first(),
      map((lists) => lists.find((list) => list.id === id)),
      mergeMap((list) => {
        if (list) {
          return of(list);
        }
        let getResponse = this.http.get<PackListResponse>(`/rest/pack-lists/${ id }/`);
        return combineLatest([getResponse, this.itemService.$itemsById, $persons]).pipe(
          first(),
          map(([list, itemMap, persons]) => this.mapPackListResponse(list, itemMap, persons))
        );
      })
    )
  }

  deletePackList(id: number): Observable<any> {
    let $delete = this.http.delete<PackList>(`/rest/pack-lists/${ id }/`);
    return combineLatest([this.$packLists, $delete]).pipe(
      first(),
      tap(([lists]) => {
        lists.splice(lists.findIndex((list) => list.id === id));
        this.$packLists.next(lists);
      })
    )
  }

  saveItemState(item: PackItem): Observable<PackItemResponse> {
    return this.http.put<PackItemResponse>(`/rest/pack-items/${ item.id }/`,
      {
        id: item.id,
        checked: item.checked,
        item: item.item.id
      });
  }

  mapPackListResponse(list: PackListResponse, itemMap: Map<number, Item>, personMap: Map<number, Template>): PackList {
    const personRetriever = (item: PackItemResponse) => {
      let personId = item.person;
      if (personId !== undefined) {
        return personMap.get(personId);
      }
      return undefined;
    }
    return {
      name: list.name,
      id: list.id,
      items: list.items.map((item) => new PackItem(item.id, itemMap.get(item.item) as Item, item.checked, item.checked_at_time, personRetriever(item))),
      shareId: list.shareId
    }
  }

  getPackLists(): Observable<PackList[]> {
    let $response = this.http.get<PackListResponse[]>('/rest/pack-lists/');
    let $persons = this.templateService.$persons
      .pipe(
        map((persons) => persons.reduce((map, person) => {
          map.set(person.id, person);
          return map;
        }, new Map<number, Template>()))
      );
    return combineLatest([$response, this.itemService.$itemsById, $persons]).pipe(
      map(([response, itemMap, persons]) => {
        return response.map((list) => this.mapPackListResponse(list, itemMap, persons))
      }),
      tap((lists) => this.$packLists.next(lists))
    );
  }

  createPackList(packList: CreatePackListRequest): Observable<PackList> {
    const data: PackListRequest = {
      name: packList.name,
      items: packList.items.map(item => {
        return {
          checked: false,
          item: item.item.id,
          person: item.person?.id
        }
      })
    };
    let $response = this.http.post<PackListResponse>('/rest/pack-lists/', data);
    let $persons = this.templateService.$persons
      .pipe(
        map((persons) => persons.reduce((map, person) => {
          map.set(person.id, person);
          return map;
        }, new Map<number, Template>()))
      );
    return combineLatest([$response, this.itemService.$itemsById, this.$packLists, $persons]).pipe(
      first(),
      map(([response, itemMap, packLists, persons]) => {
        const packList = this.mapPackListResponse(response, itemMap, persons);
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
    let $persons = this.templateService.$persons
      .pipe(
        map((persons) => persons.reduce((map, person) => {
          map.set(person.id, person);
          return map;
        }, new Map<number, Template>()))
      );
    return combineLatest([$response, this.itemService.$itemsById, this.$packLists, $persons]).pipe(
      first(),
      map(([response, itemMap, lists, persons]) => {
        let person = undefined;
        let personId = response.person;
        if (personId !== undefined) {
          person = persons.get(personId);
        }
        let packItem = new PackItem(response.id, itemMap.get(response.item)!, response.checked, response.checked_at_time, person);
        packList.items.push(packItem);
        lists.splice(lists.findIndex((list) => list.id === packList.id), 1, packList);
        this.$packLists.next(lists)
        return packList;
      })
    );
  }

  deletePackItem(item: PackItem): Observable<any> {
    return this.http.delete(`/rest/pack-items/${ item.id }`)
  }

  updatePackItem(item: PackItem): Observable<any> {
    const request: any = Object.assign({}, item);
    request.person = item.person?.id;
    request.item = item.item.id
    return this.http.patch(`/rest/pack-items/${ item.id }/`, request)
  }

  addPacklist(shareId: string): Observable<PackList> {
    const $response = this.http.patch<PackListResponse>(`/rest/add-to-list/${ shareId }/`, {}).pipe(
      catchError((error) => {
        if (error.status === 409) {
          return of(error.error);
        }
        throw error;
      })
    );
    let $persons = this.templateService.$persons
      .pipe(
        map((persons) => persons.reduce((map, person) => {
          map.set(person.id, person);
          return map;
        }, new Map<number, Template>()))
      );
    return combineLatest([$response, this.itemService.$itemsById, this.$packLists, $persons]).pipe(
      first(),
      map(([response, itemMap, packLists, persons]) => {
        const packList = this.mapPackListResponse(response, itemMap, persons);
        packLists.push(packList);
        this.$packLists.next(packLists);
        return packList;
      }),
    );
  }

  updatePackList(packList: PackList) {
    const $response = this.http.patch<PackListResponse>(`/rest/pack-lists/${ packList.id }/`, {
      id: packList.id,
      name: packList.name
    });
    let $persons = this.templateService.$persons
      .pipe(
        map((persons) => persons.reduce((map, person) => {
          map.set(person.id, person);
          return map;
        }, new Map<number, Template>()))
      );
    return combineLatest([$response, this.itemService.$itemsById, this.$packLists, $persons]).pipe(
      first(),
      map(([response, itemMap, packLists, persons]) => {
        const packList = this.mapPackListResponse(response, itemMap, persons);
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
  items: CreatePackItemRequest[];
}

export interface CreatePackItemRequest {
  item: Item;
  person?: Template;
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
  person?: number;
  checked_at_time?: number;
}

interface PackItemRequest {
  item: number;
  checked: boolean;
}
