import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TextInputComponent } from './text-input/text-input.component';
import { RadioButtonComponent } from './radio-button/radio-button.component';
import { MatCheckboxModule } from "@angular/material/checkbox";
import { RadioButtonGroupComponent } from './radio-button-group/radio-button-group.component';
import { MatRadioModule } from "@angular/material/radio";
import { MatInputModule } from "@angular/material/input";
import { MatChipsModule } from "@angular/material/chips";
import { ErrorMessageComponent } from './error-message/error-message.component';
import { SwipeableComponent } from './swipeable/swipeable.component';
import { MatIconModule } from "@angular/material/icon";
import { FilterableItemListComponent } from './filterable-item-list/filterable-item-list.component';
import { MatListModule } from "@angular/material/list";
import { MultiSelectGroupComponent } from './multi-select-group/multi-select-group.component';



@NgModule({
    declarations: [
        CheckboxComponent,
        TextInputComponent,
        RadioButtonComponent,
        RadioButtonGroupComponent,
        ErrorMessageComponent,
        SwipeableComponent,
        FilterableItemListComponent,
        MultiSelectGroupComponent
    ],
    exports: [
        CheckboxComponent,
        TextInputComponent,
        RadioButtonComponent,
        RadioButtonGroupComponent,
        ErrorMessageComponent,
        SwipeableComponent,
        FilterableItemListComponent,
        MultiSelectGroupComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatCheckboxModule,
        MatRadioModule,
        MatInputModule,
        MatChipsModule,
        MatIconModule,
        MatListModule
    ]
})
export class ComponentsModule { }
