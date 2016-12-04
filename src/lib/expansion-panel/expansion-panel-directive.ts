import {Component} from '@angular/core';
import {togglePanel} from './expansion-panel-animations';

@Component({
  moduleId: module.id,
  selector: 'md-expansion-panel',
  templateUrl: 'expansion-panel.html',
  styleUrls: ['expansion-panel.css'],
  exportAs: 'mdExpansionPanel',
  animations: [togglePanel]
})
export class MdExpansionPanel {
  isOpened: boolean = false;
}