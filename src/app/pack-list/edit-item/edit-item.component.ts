import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Item, PackItem, Template } from "../../models";
import { RadioButtonData } from "../../components/radio-button-group/radio-button-group.component";
import { LoggedInComponent } from "../../components/core";
import { AuthenticationService } from "../../authentication.service";
import { Router } from "@angular/router";
import { TemplateService } from "../../template.service";
import { PackListService } from "../../pack-list.service";

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.scss']
})
export class EditItemComponent extends LoggedInComponent {

  persons: RadioButtonData[] = [];
  result: DialogResult;

  constructor(
    public dialogRef: MatDialogRef<EditItemComponent>,
    @Inject(MAT_DIALOG_DATA) private data: PackItem,
    authService: AuthenticationService,
    router: Router,
    private templateService: TemplateService,
    private packListService: PackListService
  ) {
    super(authService, router);
    this.result = {
      item: data.item,
      person: data.person
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onLogin(): void {
    this.subscriptions.add(
      this.templateService.$persons.subscribe((persons) => {
        this.persons = persons.map((person) => {
          return {
            label: person.name,
            data: person
          }
        });
      })
    );
  }

  get selectedPerson(): RadioButtonData | undefined {
    return this.persons.find((person) => person.data.id === this.result.person?.id);
  }

  set selectedPerson(person) {
    this.result.person = person?.data;
  }

  close() {
    const result = Object.assign({}, this.data);
    result.person = this.result.person;
    result.item = this.result.item;
    this.subscriptions.add(
      this.packListService.updatePackItem(result).subscribe(() => this.dialogRef.close(this.result))
    );
  }
}

export interface DialogResult {
  item: Item;
  person?: Template;
}
