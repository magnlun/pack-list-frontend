import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent {
  @Input()
  label: string | undefined;

  @Input("checked")
  _checked: boolean = false;

  @Input()
  strikeWhenComplete: boolean = false;

  @Input()
  disabled: boolean = false;

  @Output()
  checkEvent = new EventEmitter<boolean>();

  @Output()
  textClickEvent = new EventEmitter();

  get checked(): boolean {
    return this._checked;
  }

  set checked(checked: boolean) {
    this._checked = checked;
    this.checkEvent.emit(this._checked);
  }
}
