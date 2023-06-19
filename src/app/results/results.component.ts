import { Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent {
  @Input() surveyResults: any;
  @Output() backToView2: EventEmitter<void> = new EventEmitter<void>();
  
  constructor() {
    
  }

  goBackToView2() {
    this.backToView2.emit();
  }

}
