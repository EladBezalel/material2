import {Directive, Input} from '@angular/core';
import {MdExpansionPanel} from './expansion-panel-directive';

@Directive({
  selector: '[md-expansion-panel-trigger-for]',
  exportAs: 'mdExpansionPanelTrigger',
  host: {
    '(click)': 'togglePanel()'
  }
})
export class MdExpansionPanelTrigger {
  @Input('md-expansion-panel-trigger-for') expansionPanel: MdExpansionPanel;

  togglePanel(): void {
    this.expansionPanel.isOpened = !this.expansionPanel.isOpened;
  }
}