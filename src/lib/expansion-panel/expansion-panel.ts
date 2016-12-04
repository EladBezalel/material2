import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MdExpansionPanel} from './expansion-panel-directive';
import {MdExpansionPanelTrigger} from './expansion-panel-trigger';

export {MdExpansionPanel} from './expansion-panel-directive';
export {MdExpansionPanelTrigger} from './expansion-panel-trigger';

@NgModule({
  imports: [CommonModule],
  exports: [MdExpansionPanel, MdExpansionPanelTrigger],
  declarations: [MdExpansionPanel, MdExpansionPanelTrigger],
})
export class MdExpansionPanelModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: MdExpansionPanelModule,
      providers: []
    };
  }
}