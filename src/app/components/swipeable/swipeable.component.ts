import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'app-swipeable',
  templateUrl: './swipeable.component.html',
  styleUrls: ['./swipeable.component.scss']
})
export class SwipeableComponent {

  private static readonly DELETE_DRAG_DISTANCE = 50;

  currentlyDragged = false;
  @ViewChild('draggableElement') element!: ElementRef;
  @ViewChild('button') buttonElement!: ElementRef;

  @Output()
  deleted = new EventEmitter();

  offset: number | undefined;

  pendingDelete = false;

  touchStart($event: TouchEvent) {
    this.currentlyDragged = true;
    this.offset = $event.targetTouches.item(0)!.clientX;
  }

  move($event: TouchEvent) {
    let distanceMoved = $event.targetTouches.item(0)!.clientX - (this.offset || 0);
    this.buttonElement.nativeElement.style.width = distanceMoved + 'px';
    this.pendingDelete = distanceMoved > SwipeableComponent.DELETE_DRAG_DISTANCE;
  }

  touchEnd() {
    if(parseInt(this.buttonElement.nativeElement.style.width, 10) > SwipeableComponent.DELETE_DRAG_DISTANCE) {
      setTimeout(() => {
        this.deleted.emit();
      }, 200);
    }
    this.buttonElement.nativeElement.removeAttribute('style');
    this.currentlyDragged = false;
  }
}
