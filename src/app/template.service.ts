import { Injectable } from '@angular/core';
import { Item, Template, TemplateItem } from "./models";
import { combineLatest, Observable, ReplaySubject } from "rxjs";
import { SecureHttp } from "./http-client.service";
import { first, map, tap } from "rxjs/operators";
import { PackListService } from './pack-list.service';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {

  private $persons = new ReplaySubject<Template[]>(1);
  private $destinations = new ReplaySubject<Template[]>(1);
  private $durations = new ReplaySubject<Template[]>(1);
  private $activities = new ReplaySubject<Template[]>(1);

  constructor(private http: SecureHttp, private packService: PackListService) { }

  addTemplate(selectedPersons: Template[], selectedDestinations: Template[], selectedDurations: Template[], selectedActivities: Template[], item: Item): Observable<any> {
    return this.http.post('/rest/template-items/', {
      persons: selectedPersons.map((template) => template.id),
      destinations: selectedDestinations.map((template) => template.id),
      durations: selectedDurations.map((template) => template.id),
      activities: selectedActivities.map((template) => template.id),
      item: item.id
    });
  }

  deleteTemplate(id: number): Observable<any> {
    return this.http.delete(`/rest/template-items/${id}/`);
  }

  getTemplateItems(): Observable<TemplateItem[]> {
    let response = this.http.get<TemplateItemResponse[]>('/rest/template-items/');
    return combineLatest([response, this.$persons, this.$durations, this.$destinations, this.$activities, this.packService.$itemsById]).pipe(
      first(),
      map(([response, allPersons, allDurations, allDestionations, allActivities, itemsById]) => {
        const personMap = allPersons.reduce((map, template) => {
          map.set(template.id, template)
          return map;
        }, new Map<number, Template>());
        const destinationMap = allDestionations.reduce((map, template) => {
          map.set(template.id, template)
          return map;
        }, new Map<number, Template>());
        const durationMap = allDurations.reduce((map, template) => {
          map.set(template.id, template)
          return map;
        }, new Map<number, Template>());
        const activitiesMap = allActivities.reduce((map, template) => {
          map.set(template.id, template)
          return map;
        }, new Map<number, Template>());
        return response.map((templateItem) => {
          const persons = (templateItem.persons || []).map((id) => personMap.get(id)!);
          const destinations = (templateItem.destionations || []).map((id) => destinationMap.get(id)!);
          const durations = (templateItem.durations || []).map((id) => durationMap.get(id)!);
          const activities = (templateItem.activities || []).map((id) => activitiesMap.get(id)!);
          const item = itemsById.get(templateItem.item)!;
          return {
            id: templateItem.id,
            persons,
            destinations,
            durations,
            activities,
            item
          }
        })
      })
    )
  }

  getItemsFromTemplates(selectedPersons: Template[], selectedDestinations: Template[], selectedActivities: Template[], duration: Template): Observable<Item[]> {
    const personQuery = selectedPersons.map((person) => `person=${person.id}`);
    const destinationQuery = selectedDestinations.map((person) => `destination=${person.id}`);
    const activityQuery = selectedActivities.map((person) => `activity=${person.id}`);
    const query = [...personQuery, ...destinationQuery, ...activityQuery, `duration=${duration.id}`].join('&');
    let $response = this.http.get<{ item: number }[]>(`/rest/template-items/?${query}`);
    return combineLatest([$response, this.packService.$itemsById]).pipe(
      first(),
      map(([templateItems, itemMap]) => {
        const itemIds = [...new Set(templateItems.map((item) => item.item))];
        return itemIds.map((id) => itemMap.get(id)!)
      })
    );
  }

  getPersons(): Observable<Template[]> {
    return this.http.get<Template[]>('/rest/persons/').pipe(
      map((templates) => templates.sort((a, b) => a.order - b.order)),
      tap((templates) => this.$persons.next(templates))
    );
  }
  getDestinations(): Observable<Template[]> {
    return this.http.get<Template[]>('/rest/destinations/').pipe(
      map((templates) => templates.sort((a, b) => a.order - b.order)),
      tap((templates) => this.$destinations.next(templates))
    );
  }
  getActivities(): Observable<Template[]> {
    return this.http.get<Template[]>('/rest/activities/').pipe(
      map((templates) => templates.sort((a, b) => a.order - b.order)),
      tap((templates) => this.$activities.next(templates))
    );
  }
  getDurations(): Observable<Template[]> {
    return this.http.get<Template[]>('/rest/durations/').pipe(
      map((templates) => templates.sort((a, b) => a.order - b.order)),
      tap((templates) => this.$durations.next(templates))
    );
  }

  createPerson(param: { name: string }) {
    return this.http.post<Template[]>('/rest/persons/', param);
  }

  createDuration(param: { name: string }) {
    return this.http.post<Template[]>('/rest/durations/', param);
  }

  createDestination(param: { name: string }) {
    return this.http.post<Template[]>('/rest/destinations/', param);
  }

  createActivity(param: { name: string }) {
    return this.http.post<Template[]>('/rest/activities/', param);
  }
}

interface TemplateItemResponse {
  id: number;
  persons: number[] | undefined;
  durations: number[] | undefined;
  destionations: number[] | undefined;
  activities: number[] | undefined;
  item: number;
}
