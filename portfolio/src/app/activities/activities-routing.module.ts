import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TfeComponent} from "./tfe/tfe.component";

const routes: Routes = [
    { path: 'tfe', component: TfeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActivitiesRoutingModule { }
