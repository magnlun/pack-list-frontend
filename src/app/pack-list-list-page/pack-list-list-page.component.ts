import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {  PackListService } from '../pack-list.service';
import { PackList } from "../models";
import { Router } from "@angular/router";
import { AuthenticationService } from "../authentication.service";

@Component({
  selector: 'app-pack-list-list-page',
  templateUrl: './pack-list-list-page.component.html',
  styleUrls: ['./pack-list-list-page.component.scss']
})
export class PackListListPageComponent implements OnInit, OnDestroy {

  private subscriptions = new Subscription();

  packLists: PackList[] = [];

  constructor(private service: PackListService, private router: Router, private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.subscriptions.add(
      this.service.$packLists.subscribe((packLists) => this.packLists = packLists)
    )
    this.subscriptions.add(
      this.authService.loggedIn$.subscribe((loggedIn) => {
        if(!loggedIn) {
          this.router.navigate(["/login"])
        }
      })
    )
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
