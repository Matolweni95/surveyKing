import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css']
})
export class SurveyComponent {
  surveyForm!: FormGroup;
  currentDate!: string;
  isCheckboxSelected = false;
  activeView!: string;

  @Output() backToView1: EventEmitter<void> = new EventEmitter<void>();

constructor(private formBuilder: FormBuilder, private http: HttpClient) {
  this.activeView = 'view1';
  const today = new Date();
  const day = today.getDate().toString().padStart(2, '0');
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const year = today.getFullYear().toString();
  this.currentDate = `${day}/${month}/${year}`;
}

ngOnInit(): void {
  this.surveyForm = this.formBuilder.group({
  surname: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
  name: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
  contactNumber: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
  age: ['', [Validators.required, Validators.min(5), Validators.max(120)]],
  pizza: [false],
  pasta: [false],
  papAndWors: [false],
  chickenStirFry: [false],
  beefStirFry: [false],
  other: [false],
  eatOut: [null, [Validators.required]],
  watchMovies: [null, [Validators.required]],
  watchTV: [null, [Validators.required]],
  listenToRadio: [null, [Validators.required]],
  date: [this.currentDate]
});

this.surveyForm.valueChanges.subscribe(() => {
  this.isCheckboxSelected = this.isAtLeastOneCheckboxSelected();
  });
}

//Form submit

async onSubmit(): Promise<void> {
  if (this.surveyForm.invalid || !this.isAtLeastOneCheckboxSelected()) {
    alert('Please fill out all the required fields and select at least one checkbox.');
    return;
  }
  
  const name = this.surveyForm.get('name')?.value;
  const surname = this.surveyForm.get('surname')?.value;
  const age = this.surveyForm.get('age')?.value;
  const contact_number = this.surveyForm.get('contactNumber')?.value.toString();
  const date = this.surveyForm.get('date')?.value;
  
  const eatOut = this.surveyForm.get('eatOut')?.value;
  const watchMovies = this.surveyForm.get('watchMovies')?.value;
  const watchTV = this.surveyForm.get('watchTV')?.value;
  const listenToRadio = this.surveyForm.get('listenToRadio')?.value;

  const favoriteFoodFields = ['pizza', 'pasta', 'papAndWors', 'chickenStirFry', 'beefStirFry', 'other'];
  const favorite_food = favoriteFoodFields.filter(field => this.surveyForm.get(field)?.value);
  
const surveyData = {
  name,
  surname,
  age,
  contact_number,
  date,
  eatOut,
  watchMovies,
  watchTV,
  listenToRadio,
  eat_out: this.surveyForm.get('eatOut')?.value,
  watch_movies: this.surveyForm.get('watchMovies')?.value,
  watch_tv: this.surveyForm.get('watchTV')?.value,
  listen_to_radio: this.surveyForm.get('listenToRadio')?.value,
  favorite_food,
};
  
try {
  const apiUrl = 'http://localhost:3000/survey'; 
  const response = await this.http.post(apiUrl, surveyData).toPromise();
    this.surveyForm.reset();
    this.backToView1.emit();
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while submitting the survey response.');
  }
}

// Start form validation

isAtLeastOneCheckboxSelected(): boolean {
  const formValues = this.surveyForm.value;
  const selectedCheckboxes = Object.values(formValues).filter(value => value === true);
  return selectedCheckboxes.length > 0;
}

isRadioGroupSelected(controlName: string) {
  const control = this.surveyForm.get(controlName);
  return control && control.value !== null && control.value !== undefined;
}

  //end form validation

  goBackToView1() {
    this.backToView1.emit();
  }
}



