import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroupDirective, NgForm } from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss']
})
export class TextInputComponent implements OnChanges {
  @Input()
  label: string = '';

  @Input()
  model: string = '';

  @Input()
  type: string = 'text';

  @Output("model")
  changeEvent = new EventEmitter<string>();

  @Output()
  enterPressed = new EventEmitter<string>();

  @Output()
  focusLost = new EventEmitter();

  @Input()
  focus: boolean = false;

  @Input()
  validationError: string | undefined;

  @ViewChild('inputElement') inputElement!: ElementRef;

  matcher = new MyErrorStateMatcher(() => this.validationError);

  triggerSubmit() {
    this.enterPressed.emit(this.model)
  }

  textChange($event: string) {
    this.model = $event;
    this.changeEvent.emit($event)
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['focus'] && changes['focus'].currentValue) {
      setTimeout(() => {
        this.inputElement.nativeElement.focus();
      }, 100);
    }
  }
}

export class MyErrorStateMatcher implements ErrorStateMatcher {

  constructor(private errorText: () => string | undefined) {
  }
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return !!this.errorText();
  }
}
