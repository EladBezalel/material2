import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OverlayModule, OVERLAY_PROVIDERS} from '../core';

import {MdAutocomplete} from './autocomplete-directive';
import {MdAutocompleteItem} from './autocomplete-item';
import {MdAutocompleteTrigger} from './autocomplete-trigger';
export {MdAutocomplete} from './autocomplete-directive';
export {MdAutocompleteItem} from './autocomplete-item';
export {MdAutocompleteTrigger} from './autocomplete-trigger';


@NgModule({
  imports: [OverlayModule, CommonModule],
  exports: [MdAutocomplete, MdAutocompleteItem, MdAutocompleteTrigger],
  declarations: [MdAutocomplete, MdAutocompleteItem, MdAutocompleteTrigger],
})
export class MdAutocompleteModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: MdAutocompleteModule,
      providers: OVERLAY_PROVIDERS,
    };
  }
}
