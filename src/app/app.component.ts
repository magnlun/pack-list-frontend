import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { PackListService } from "./pack-list.service";
import { interval, Subscription } from "rxjs";
import { AuthenticationService } from "./authentication.service";
import { LayoutService } from "./layout.service";
import { distinctUntilChanged } from "rxjs/operators";
import { ErrorHandlingService } from "./error-handling.service";
import { TemplateService } from "./template.service";
import { ItemService } from "./item.service";

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
  loaded = false;
  hasError = false;
  constructor(private service: PackListService, private authService: AuthenticationService, private layoutService: LayoutService, private errorService: ErrorHandlingService, private templateService: TemplateService, private itemService: ItemService) {}
  ngOnInit(): void {
    this.subscriptions.add(
      this.errorService.$hasMajorError.subscribe((error) => this.hasError = true)
    )
    this.subscriptions.add(
      this.itemService.getItems().subscribe()
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
        .subscribe((jwtToken) => {
          if(jwtToken) {
            this.subscriptions.add(
              this.authService.saveToken(jwtToken).subscribe()
            );
          }
          else {
            this.authService.deleteToken();
          }
          this.authService.loggedIn$.next(!!jwtToken)
        })
    );
    this.subscriptions.add(
      this.authService.loggedIn$.pipe(
        distinctUntilChanged()
      ).subscribe((loggedIn) => {
        this.loaded = true;
        this.loggedIn = loggedIn;
        if(loggedIn) {
          this.subscriptions.add(this.service.getPackLists().subscribe());
          this.subscriptions.add(
            this.templateService.getPersons().subscribe()
          );
          this.subscriptions.add(
            this.templateService.getActivities().subscribe()
          );
          this.subscriptions.add(
            this.templateService.getDestinations().subscribe()
          );
          this.subscriptions.add(
            this.templateService.getDurations().subscribe()
          );
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
