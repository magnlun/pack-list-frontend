import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-radio-button-group',
  templateUrl: './radio-button-group.component.html',
  styleUrls: ['./radio-button-group.component.scss']
})
export class RadioButtonGroupComponent {

  @Input()
  buttons: RadioButtonData[] = [];

  @Input()
  selectedButton: RadioButtonData | undefined;

  @Output('selectedButton')
  selectEmitter = new EventEmitter<RadioButtonData>();

  setSelectedButton(buttonData: RadioButtonData) {
    this.selectedButton = buttonData;
    this.selectEmitter.emit(buttonData);
  }

}

export interface RadioButtonData {
  label: string;
  data: any;
}
