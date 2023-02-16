import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {TfeComponent} from "./tfe/tfe.component";

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent {
  constructor(private router: Router) { }

  goToTfe() {
    this.router.navigate(['/activities/tfe']);
  }
}
