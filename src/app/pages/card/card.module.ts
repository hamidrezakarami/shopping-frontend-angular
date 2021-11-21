import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Ng5SliderModule } from 'ng5-slider';
import { MaterialModule } from 'src/shared/material.module';
import { CardRoutingModule } from './card-routing.module';
import { CardComponent } from './card.component';
@NgModule({
  declarations: [CardComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    CardRoutingModule,
    Ng5SliderModule,
  ],
  providers: [],
})
export class CardModule {}
