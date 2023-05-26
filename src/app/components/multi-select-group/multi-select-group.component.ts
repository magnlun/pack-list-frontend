import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RadioButtonData } from "../radio-button-group/radio-button-group.component";

@Component({
  selector: 'app-multi-select-group',
  templateUrl: './multi-select-group.component.html',
  styleUrls: ['./multi-select-group.component.scss']
})
export class MultiSelectGroupComponent {

  @Input()
  buttons: RadioButtonData[] = [];

  @Input()
  selectedButtons: RadioButtonData[] = [];

  @Output('selectedButtons')
  selectEmitter = new EventEmitter<RadioButtonData[]>();

  setSelectedButtons(buttonData: RadioButtonData[]) {
    this.selectedButtons = buttonData;
    this.selectEmitter.emit(buttonData);
  }
}
