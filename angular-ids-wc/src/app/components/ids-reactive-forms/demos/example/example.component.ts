import { Component, OnInit } from '@angular/core';
import { FormsModule, FormGroup, FormControl, Validators} from '@angular/forms'

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.css']
})
export class ExampleComponent implements OnInit {

  public testForm: FormGroup;

  constructor() { }

  ngOnInit(): void {
    this.testForm = new FormGroup({
      testCheckbox: new FormControl(),
      testCheckboxGroup: new FormControl(),
      testDateObject: new FormControl(new Date()),
      testDateString: new FormControl('12/31/2020'),
      testDropdown: new FormControl('opt5'),
      testInput: new FormControl('Original value', Validators.minLength(2)),
      testLookup: new FormControl(),
      testTextarea: new FormControl(),
      testTimePicker: new FormControl(),
      testRadio: new FormControl(),
      testSearchField: new FormControl(),
      testSpinbox: new FormControl(),
      testSwitch: new FormControl(),
      testUpload: new FormControl(),
      testUploadAdvanced: new FormControl(),
    });
  }

  public onFormSubmit() {
    console.log(`FormControl(testCheckbox) value is: ${this.testForm.controls['testCheckbox'].value}`);
    console.log(`FormControl(testCheckboxGroup) value is: ${this.testForm.controls['testCheckboxGroup'].value}`);
    console.log(`FormControl(testDateObject) value is: ${this.testForm.controls['testDateObject'].value}`);
    console.log(`FormControl(testDateString) value is: ${this.testForm.controls['testDateString'].value}`);
    console.log(`FormControl(testDropdown) value is: ${this.testForm.controls['testDropdown'].value}`);
    console.log(`FormControl(testInput) value is: ${this.testForm.controls['testInput'].value}`);
    console.log(`FormControl(testLookup) value is: ${this.testForm.controls['testLookup'].value}`);
    console.log(`FormControl(testTextarea) value is: ${this.testForm.controls['testTextarea'].value}`);
    console.log(`FormControl(testTimePicker) value is: ${this.testForm.controls['testTimePicker'].value}`);
    console.log(`FormControl(testRadio) value is: ${this.testForm.controls['testRadio'].value}`);
    console.log(`FormControl(testSearchField) value is: ${this.testForm.controls['testSearchField'].value}`);
    console.log(`FormControl(testSpinbox) value is: ${this.testForm.controls['testSpinbox'].value}`);
    console.log(`FormControl(testSwitch) value is: ${this.testForm.controls['testSwitch'].value}`);
    console.log(`FormControl(testUpload) value is: ${this.testForm.controls['testUpload'].value}`);
    console.log(`FormControl(testUploadAdvanced) value is: ${this.testForm.controls['testUploadAdvanced'].value}`);


    document.querySelectorAll<any>('[ngDefaultControl]').forEach((input) => {
      console.log(`${input?.name} -> value is: `, input.value);
    });
  }

  public updateModel() {
    const randomText = (wordCount) => Array(wordCount).fill(Math.random().toString(32).substring(2)).join(' ');

    this.testForm.controls['testDateObject'].setValue(new Date());
    this.testForm.controls['testDateString'].setValue((new Date()).toDateString());
    this.testForm.controls['testDropdown'].setValue(!this.testForm.controls['testDropdown'].value);
    this.testForm.controls['testInput'].setValue(randomText(2));
    this.testForm.controls['testLookup'].setValue(!this.testForm.controls['testLookup'].value);
    this.testForm.controls['testTextarea'].setValue(randomText(9));
    this.testForm.controls['testTimePicker'].setValue(!this.testForm.controls['testTimePicker'].value);
    this.testForm.controls['testRadio'].setValue(!this.testForm.controls['testRadio'].value);
    this.testForm.controls['testSearchField'].setValue(randomText(3));
    this.testForm.controls['testSpinbox'].setValue(!this.testForm.controls['testSpinbox'].value);
    this.testForm.controls['testUpload'].setValue(!this.testForm.controls['testUpload'].value);
    this.testForm.controls['testUploadAdvanced'].setValue(!this.testForm.controls['testUploadAdvanced'].value);

    this.testForm.controls['testSwitch'].setValue(!this.testForm.controls['testSwitch'].value);
    this.testForm.controls['testCheckbox'].setValue(!this.testForm.controls['testCheckbox'].value);
    this.testForm.controls['testCheckboxGroup'].setValue(!this.testForm.controls['testCheckboxGroup'].value);

    this.onFormSubmit();
  }

}
