import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TfeComponent} from "./tfe/tfe.component";
import {ActivitiesComponent} from "./activities.component";

const routes: Routes = [{
  path: '',
  component: ActivitiesComponent,
  children: [{
    path: 'tfe',
    component: TfeComponent,
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActivitiesRoutingModule { }
