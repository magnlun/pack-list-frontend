import { Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from "@angular/cdk/layout";
import { tap } from "rxjs/operators";
import { Observable, ReplaySubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  screenSize = new ReplaySubject(1);

  constructor(private breakpointObserver: BreakpointObserver) { }

  setupSizeObserver(): Observable<BreakpointState> {
    return this.breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
      ])
      .pipe(
        tap((result) => {
          for (const query of Object.keys(result.breakpoints)) {
            if (result.breakpoints[query]) {
              this.screenSize.next(query)
            }
          }
        })
      );
  }
}
