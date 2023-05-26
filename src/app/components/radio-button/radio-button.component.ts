import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-radio-button',
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.scss']
})
export class RadioButtonComponent {

  @Input()
  label: string = '';

  @Input('selected')
  _selected: boolean = false;

  @Output('selected')
  selectEvent = new EventEmitter<boolean>();

  get selected(): boolean {
    return this._selected;
  }

  set selected(selected: boolean) {
    this._selected = selected;
    this.selectEvent.emit(this._selected);
  }

}
