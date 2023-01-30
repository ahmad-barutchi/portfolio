import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'portfolio';

  constructor(private router: Router) { }
  goToHome() {
    this.router.navigate(['/home']);
  }
  goToContact() {
    this.router.navigate(['/contact']);
  }
  goToProjects() {
    this.router.navigate(['/projects']);
  }
  goToAbout() {
    this.router.navigate(['/about']);
  }

}
