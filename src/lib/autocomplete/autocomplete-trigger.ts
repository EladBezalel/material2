import {
  Directive,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  HostListener,
  ViewContainerRef,
  AfterViewInit,
  OnDestroy,
  Renderer,
  forwardRef
} from '@angular/core';
import {MdAutocomplete} from './autocomplete-directive';
// import {MdMenuMissingError} from './menu-errors';
import {
    ENTER,
    SPACE,
    Overlay,
    OverlayState,
    OverlayRef,
    TemplatePortal,
    ConnectedPositionStrategy,
    HorizontalConnectionPos,
    VerticalConnectionPos
} from '../core';

import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

import { Subscription } from 'rxjs/Subscription';

/**
 * This directive is intended to be used in conjunction with an md-autocomplete tag.  It is
 * responsible for toggling the display of the provided menu instance.
 */
@Directive({
  selector: '[md-autocomplete-trigger-for]',
  host: {
    'aria-haspopup': 'true',
    '(keydown)': '_handleKeydown($event)',
    '[class]': '"md-autocomplete-input"',
    '(input)': '_onInputChange($event)'
  },
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MdAutocompleteTrigger),
    multi: true
  }],
  exportAs: 'MdAutocompleteTrigger'
})
export class MdAutocompleteTrigger implements AfterViewInit, OnDestroy, ControlValueAccessor {
  onChange = (fn: any) => {};

  writeValue(obj: any): void {
    console.log(obj);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
  }
  private _portal: TemplatePortal;
  private _overlayRef: OverlayRef;
  private _menuOpen: boolean = false;
  private _backdropSubscription: Subscription;

  // tracking input type is necessary so it's possible to only auto-focus
  // the first item of the list when the menu is opened via the keyboard
  private _openedFromKeyboard: boolean = false;

  @Input('md-autocomplete-trigger-for') autocomplete: MdAutocomplete;
  @Output() onMenuOpen = new EventEmitter<void>();
  @Output() onMenuClose = new EventEmitter<void>();

  constructor(private _overlay: Overlay, private _element: ElementRef,
              private _viewContainerRef: ViewContainerRef, private _renderer: Renderer) {
    this._element.nativeElement.classList.add('md-autocomplete-input');
  }

  ngAfterViewInit() {
    this.autocomplete.setTriggerElement(this._element);
    this.autocomplete.registerOnChange((value: any) => {
      this._changeInput(value);
    });

    this._checkMenu();
    this.autocomplete.close.subscribe(() => this.closeMenu());
  }

  ngOnDestroy() { this.destroyMenu(); }

  get menuOpen(): boolean { return this._menuOpen; }

  @HostListener('click')
  @HostListener('focus')
  toggleMenu(): void {
    return this._menuOpen ? this.closeMenu() : this.openMenu();
  }

  openMenu(): void {
    if (!this._menuOpen) {
      this._createOverlay();
      this._overlayRef.attach(this._portal);
      this._subscribeToBackdrop();
      this._initMenu();
    }
  }

  closeMenu(): void {
    if (this._overlayRef) {
      this._overlayRef.detach();
      this._backdropSubscription.unsubscribe();
      this._resetMenu();
    }
  }

  destroyMenu(): void {
    if (this._overlayRef) {
      this._overlayRef.dispose();
      this._overlayRef = null;

      if (this._backdropSubscription) {
        this._backdropSubscription.unsubscribe();
      }
    }
  }

  focus() {
    this._renderer.invokeElementMethod(this._element.nativeElement, 'focus');
  }

  /**
   * This method ensures that the menu closes when the overlay backdrop is clicked.
   * We do not use first() here because doing so would not catch clicks from within
   * the menu, and it would fail to unsubscribe properly. Instead, we unsubscribe
   * explicitly when the menu is closed or destroyed.
   */
  private _subscribeToBackdrop(): void {
    this._backdropSubscription = this._overlayRef.backdropClick().subscribe(() => {
      this.closeMenu();
    });
  }

  /**
   * This method sets the menu state to open and focuses the first item if
   * the menu was opened via the keyboard.
   */
  private _initMenu(): void {
    this._setIsMenuOpen(true);

    if (this._openedFromKeyboard) {
      this.autocomplete._focusFirstItem();
    }
  };

  /**
   * This method resets the menu when it's closed, most importantly restoring
   * focus to the menu trigger if the menu was opened via the keyboard.
   */
  private _resetMenu(): void {
    this._setIsMenuOpen(false);

    if (this._openedFromKeyboard) {
      this.focus();
      this._openedFromKeyboard = false;
    }
  }

  // set state rather than toggle to support triggers sharing a menu
  private _setIsMenuOpen(isOpen: boolean): void {
    this._menuOpen = isOpen;
    this._menuOpen ? this.onMenuOpen.emit() : this.onMenuClose.emit();
  }

  /**
   *  This method checks that a valid instance of MdMenu has been passed into
   *  md-menu-trigger-for.  If not, an exception is thrown.
   */
  private _checkMenu() {
    if (!this.autocomplete || !(this.autocomplete instanceof MdAutocomplete)) {
      // throw new MdMenuMissingError();
    }
  }

  /**
   *  This method creates the overlay from the provided menu's template and saves its
   *  OverlayRef so that it can be attached to the DOM when openMenu is called.
   */
  private _createOverlay(): void {
    if (!this._overlayRef) {
      this._portal = new TemplatePortal(this.autocomplete.templateRef, this._viewContainerRef);
      this._overlayRef = this._overlay.create(this._getOverlayConfig());
    }
  }

  /**
   * This method builds the configuration object needed to create the overlay, the OverlayState.
   * @returns OverlayState
   */
  private _getOverlayConfig(): OverlayState {
    const overlayState = new OverlayState();
    overlayState.positionStrategy = this._getPosition();
    overlayState.hasBackdrop = true;
    overlayState.backdropClass = 'md-overlay-transparent-backdrop';
    overlayState.width = this._element.nativeElement.offsetWidth;
    return overlayState;
  }

  /**
   * This method builds the position strategy for the overlay, so the menu is properly connected
   * to the trigger.
   * @returns ConnectedPositionStrategy
   */
  private _getPosition(): ConnectedPositionStrategy  {
    const positionX: HorizontalConnectionPos = 'start';
    const positionY: VerticalConnectionPos = 'bottom';

    return this._overlay.position().connectedTo(
      this._element,
      {originX: positionX, originY: positionY},
      {overlayX: positionX, overlayY: 'top'}
    );
  }

  // TODO: internal
  _handleKeydown(event: KeyboardEvent): void {
    if (event.keyCode === ENTER || event.keyCode === SPACE) {
      this._openedFromKeyboard = true;
    }
  }

  _onInputChange(event: any): void{
    this._changeInput(event.target.value);
  }

  _changeInput(text: string): void {
    this.onChange(text);
    this._element.nativeElement.value = text;
    this.autocomplete.items.forEach(item => item.filter(text));
  }
}
