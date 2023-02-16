import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {AboutComponent} from "./about/about.component";
import {ProjectsComponent} from "./projects/projects.component";
import {ContactComponent} from "./contact/contact.component";
import {ActivitiesComponent} from "./activities/activities.component";
import {TfeComponent} from "./activities/tfe/tfe.component";
import {AppComponent} from "./app.component";

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'about', component: AboutComponent },
  { path: 'activities/tfe', component: TfeComponent },
  { path: 'activities', component: ActivitiesComponent,
    loadChildren: () => import('./activities/activities.module').then(m => m.ActivitiesModule) },
  { path: '**', redirectTo: '/home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
