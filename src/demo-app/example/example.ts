import {Component, Input} from '@angular/core';

@Component({
  selector: 'example',
  templateUrl: 'example/example.html',
  styleUrls: ['example/example.css']
})
export class Example {
  @Input() demo: Object;
}