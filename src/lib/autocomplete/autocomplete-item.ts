import {
  Component, ElementRef, Input, HostBinding, Renderer, TemplateRef, ViewChild, EventEmitter,
  Output
} from '@angular/core';
import {MdFocusable} from '../core/a11y/list-key-manager';

/**
 * This directive is intended to be used inside an md-menu tag.
 * It exists mostly to set the role attribute.
 */
@Component({
  moduleId: module.id,
  selector: 'md-autocomplete-item',
  host: {
    'role': 'menuitem',
    '(click)': '_select(value)'
  },
  templateUrl: 'item.html',
  exportAs: 'mdAutocompleteItem'
})
export class MdAutocompleteItem implements MdFocusable {
  constructor(private _renderer: Renderer, private _elementRef: ElementRef) {}

  focus(): void {
    this._renderer.invokeElementMethod(this._elementRef.nativeElement, 'focus');
  }

  @Input() private value: any;
  @Output() onSelect = new EventEmitter<string>();

  filter(text: String) {
    let display = '';

    if (this.value.toLowerCase().indexOf(text.toLowerCase()) < 0) {
      display = 'none'
    }

    this._elementRef.nativeElement.style.display = display;
  }

  _select (value: string) {
    this.onSelect.emit(value);
  }
}

