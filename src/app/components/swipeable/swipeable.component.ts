import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import interact from 'interactjs';

@Component({
  selector: 'app-swipeable',
  templateUrl: './swipeable.component.html',
  styleUrls: ['./swipeable.component.scss']
})
export class SwipeableComponent implements AfterViewInit {

  private static readonly DELETE_DRAG_DISTANCE = 50;

  @Input()
  model: any;

  @Input()
  options: any = {
    startAxis: 'x',
    lockAxis: 'x'
  };

  @Output()
  draggableClick = new EventEmitter();

  currentlyDragged = false;
  buttonHidden = true;
  @ViewChild('draggableElement') element!: ElementRef;
  @ViewChild('button') buttonElement!: ElementRef;

  @Output()
  deleted = new EventEmitter();

  pendingDelete = false;

  @HostListener('click', ['$event'])
  public onClick(event: any): void {
    if (!this.currentlyDragged) {
      this.draggableClick.emit();
    }
  }

  ngAfterViewInit(): void {
    interact(this.element.nativeElement)
      .draggable(Object.assign({}, this.options || {}))
      .on('dragmove', (event) => {
        const target = event.target;
        let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;

        if(x < 0) {
          x = 0
        }
        this.pendingDelete = x > SwipeableComponent.DELETE_DRAG_DISTANCE;

        this.buttonElement.nativeElement.style.width = x + 'px';
        target.setAttribute('data-x', x);

        target.classList.add('getting-dragged');
        this.currentlyDragged = true;
        (window as any).dragData = this.model;
      })
      .on('dragend', (event) => {
        if(parseInt(this.buttonElement.nativeElement.style.width, 10) > SwipeableComponent.DELETE_DRAG_DISTANCE) {
          setTimeout(() => {
            this.deleted.emit();
          }, 200);
        }
        this.buttonElement.nativeElement.removeAttribute('style');
        event.target.removeAttribute('data-x');
        event.target.classList.remove('getting-dragged');
        setTimeout(() => {
          (window as any).dragData = null;
          this.currentlyDragged = false;
        });
      });
  }

  deleteClicked() {
    this.deleted.emit();
  }
}
