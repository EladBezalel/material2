import {Component} from '@angular/core';


@Component({
  moduleId: module.id,
  selector: 'autocomplete-demo',
  templateUrl: 'autocomplete-demo.html',
  styleUrls: ['autocomplete-demo.css'],
})
export class AutocompleteDemo {
  data: string[] = ["John", "Robert", "Mark"];
  model = 'John';

  add(item: string) {
    this.data.push(item);
  }
}
