import { AfterViewInit, Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-form-input',
  templateUrl: './form-input.component.html',
  styleUrls: ['./form-input.component.scss'],
})
export class FormInputComponent implements AfterViewInit {
  @Output() formValidate = new EventEmitter<FormGroup>();
  constructor(private _formBuilder: FormBuilder) {
    this.firstFormGroup.valueChanges.subscribe(() => {
      this.formValidate.emit(this.firstFormGroup);
    });
    this.formValidate.emit(this.firstFormGroup);
  }

  ngAfterViewInit(): void {
    this.resetForm();
  }

  firstFormGroup = this._formBuilder.group({
    p1Value: ['', Validators.required],
    AtValue: ['', Validators.required],
    KValue: ['', Validators.required],
    LValue: ['', Validators.required],
    uValue: ['', Validators.required],
    eValue: ['', Validators.required],
    fpuValue: ['', Validators.required],
    hcValue: ['', Validators.required],
    EaValue: ['', Validators.required],
    yhValue: ['', Validators.required],
    fciValue: ['', Validators.required],
    MdcValue: ['', Validators.required],
    MllValue: ['', Validators.required],
    AValue: ['', Validators.required],
    IValue: ['', Validators.required],
    RHValue: ['', Validators.required],
  });

  demoValue() {
    this.firstFormGroup.setValue({
      p1Value: '130826.748',
      AtValue: '9.87',
      KValue: '0.0012',
      LValue: '15',
      uValue: '0.2',
      eValue: '0.31',
      fpuValue: '18982.879',
      hcValue: '1',
      EaValue: '2000000',
      yhValue: '2400',
      fciValue: '280',
      MdcValue: '19858.5',
      MllValue: '19687.5',
      AValue: '2942',
      IValue: '898227',
      RHValue: '75',
    });
    this.formValidate.emit(this.firstFormGroup);
  }
  resetForm() {
    this.firstFormGroup.reset();
    this.formValidate.emit(this.firstFormGroup);
  }
  calculate(){
    this.formValidate.emit(this.firstFormGroup);
  }
}
