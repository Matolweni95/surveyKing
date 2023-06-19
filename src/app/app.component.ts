import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  @Input() surveyResults: any;
  activeView: string;

  constructor(private http: HttpClient) {
    this.activeView = 'view1';
  }


  setActiveView(view: string) {
    this.activeView = view;
  }

  fetchSurveyResults() {
    this.activeView = 'view3';
  
    // Make an HTTP GET request to fetch the survey results from the server
    const apiUrl = 'http://localhost:3000/survey/statistics';
  
    this.http.get(apiUrl).subscribe(
      (response: any) => {
        this.surveyResults = response;
        console.log(this.surveyResults); 
      },
      (error) => {
        console.error('Error:', error);
        alert('An error occurred while fetching the survey results.');
      }
    );
  }

}
