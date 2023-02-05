import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActivitiesRoutingModule } from './activities-routing.module';
import { TfeComponent } from './tfe/tfe.component';
import {MatCardModule} from "@angular/material/card";
import {MatChipsModule} from "@angular/material/chips";


@NgModule({
  declarations: [
    TfeComponent
  ],
  imports: [
    CommonModule,
    ActivitiesRoutingModule,
    MatCardModule,
    MatChipsModule,
  ]
})
export class ActivitiesModule { }
