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

  // navigation methods
  goToHome() {
    this.router.navigate(['/']);
    this.changeBg();
  }
  goToContact() {
    this.router.navigate(['/contact']);
    this.changeBg();
  }
  goToProjects() {
    this.router.navigate(['/projects']);
    this.changeBg();
  }
  goToActivities() {
    this.router.navigate(['/activities']);
    this.changeBg();
  }
  goToAbout() {
    this.router.navigate(['/about']);
    this.changeBg();
  }

  // background images
  backgroundImage: string = '';
  images: string[] = ['bg1.jpg', 'bg2.jpg', 'bg3.jpg', 'bg4.jpg', 'bg5.jpg'];

  ngOnInit() {
    let ran = Math.round((Math.random()*100)%4);
    this.backgroundImage = this.images[ran];
  }

  changeBg() {
    let ran = Math.round((Math.random()*100)%4);
    this.backgroundImage = this.images[ran];
  }

}
