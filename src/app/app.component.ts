import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { PackListService } from "./pack-list.service";
import { interval, Subscription } from "rxjs";
import { AuthenticationService } from "./authentication.service";
import { LayoutService } from "./layout.service";

@Component({
  selector: 'app-root',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './app.component.html',
  styleUrls: [
    './app.component.scss'
  ]
})
export class AppComponent implements OnInit, OnDestroy {

  private subscriptions = new Subscription();
  loggedIn = false;
  constructor(private service: PackListService, private authService: AuthenticationService, private layoutService: LayoutService) {}
  ngOnInit(): void {
    this.subscriptions.add(
      this.service.getItems().subscribe()
    );
    this.subscriptions.add(
      this.authService.checkLoginStatus().subscribe()
    );
    this.subscriptions.add(
      this.layoutService.setupSizeObserver().subscribe()
    );
    this.subscriptions.add(
      interval(60 * 1000).subscribe(() => {
        if(this.loggedIn) {
          this.subscriptions.add(
            this.authService.refreshToken().subscribe()
          );
        }
      })
    )
    this.subscriptions.add(
      this.authService.$jwtToken
        .subscribe((jwtToken) => this.authService.loggedIn$.next(!!jwtToken))
    );
    this.subscriptions.add(
      this.authService.loggedIn$.subscribe((loggedIn) => {
        this.loggedIn = loggedIn;
        if(loggedIn) {
          this.subscriptions.add(this.service.getPackLists().subscribe());
        }
        else {
          this.service.$packLists.next([]);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

}
