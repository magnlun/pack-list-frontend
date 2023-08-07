import { Component, OnDestroy, OnInit } from '@angular/core';
import { PackListService } from '../pack-list.service';
import { Subscription } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-share-pack-list-page',
  templateUrl: './share-pack-list-page.component.html',
  styleUrls: ['./share-pack-list-page.component.scss']
})
export class SharePackListPageComponent implements OnDestroy, OnInit {


  private subscriptions = new Subscription();
  private shareId = '';

  isLoggedIn = false;
  loading = true;

  constructor(private service: PackListService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {

    this.subscriptions.add(
      this.route.paramMap.subscribe(params => {
        const paramId = params.get('id');
        if(paramId) {
          this.shareId = paramId;
        }
        else {
          this.router.navigate(['/login'])
        }
      })
    );
  }

  loggedIn(loggedIn: boolean) {
    if(loggedIn) {
      this.subscriptions.add(
        this.service.addPacklist(this.shareId).subscribe((list) => {
          this.router.navigate(['/list', list.id])
        })
      );
    }
    this.isLoggedIn = loggedIn;
    this.loading = false;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
