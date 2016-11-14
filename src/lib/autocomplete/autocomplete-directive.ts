import {
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewEncapsulation, ElementRef
} from '@angular/core';
import {MdAutocompleteItem} from './autocomplete-item';
import {ListKeyManager} from '../core/a11y/list-key-manager';

@Component({
  moduleId: module.id,
  selector: 'md-autocomplete',
  host: {'role': 'autocomplete'},
  templateUrl: 'autocomplete.html',
  styleUrls: ['autocomplete.css'],
  encapsulation: ViewEncapsulation.None,
  exportAs: 'mdAutocomplete'
})
export class MdAutocomplete {
  private _keyManager: ListKeyManager;
  protected trigger: ElementRef;

  // config object to be passed into the menu's ngClass
  _classList: Object;

  @ViewChild(TemplateRef) templateRef: TemplateRef<any>;
  @ContentChildren(MdAutocompleteItem) items: QueryList<MdAutocompleteItem>;

  ngAfterContentInit() {
    this._keyManager = new ListKeyManager(this.items);
    this._keyManager.tabOut.subscribe(() => this._emitCloseEvent());
  }

  /**
   * This method takes classes set on the host md-menu element and applies them on the
   * menu template that displays in the overlay container.  Otherwise, it's difficult
   * to style the containing menu from outside the component.
   * @param classes list of class names
   */
  @Input('class')
  set classList(classes: string) {
    this._classList = classes.split(' ').reduce((obj: any, className: string) => {
      obj[className] = true;
      return obj;
    }, {});
  }

  @Output() close = new EventEmitter<void>();

  /**
   * Focus the first item in the menu. This method is used by the menu trigger
   * to focus the first item when the menu is opened by the ENTER key.
   * TODO: internal
   */
  _focusFirstItem() {
    // The menu always opens with the first item focused.
    this.items.first.focus();
    this._keyManager.focusFirstItem();
  }
  /**
   * This emits a close event to which the trigger is subscribed. When emitted, the
   * trigger will close the menu.
   */
  private _emitCloseEvent(): void {
    this.close.emit();
  }

  setTriggerElement (element: ElementRef) {
    this.trigger = element;
  }

  registerOnChange(fn: any) {
    this.items.forEach((item: MdAutocompleteItem) => {
      item.onSelect.subscribe((value: any)=> {
        fn(value);
        this._emitCloseEvent();
      });
    });
  }
}