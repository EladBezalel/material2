import {TestBed, async} from '@angular/core/testing';
import {Component} from '@angular/core';
import {MdAutocompleteModule} from './index';


describe('MdAutocomplete', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MdAutocompleteModule.forRoot()],
      declarations: [TestAutocomplete],
    });

    TestBed.compileComponents();
  }));

  it('should test', () => {
    // let fixture = TestBed.createComponent(TestSelect);
    expect(true).toBeTruthy();
  });
});

@Component({selector: 'test-autocomplete', template: ``})
class TestAutocomplete {}
