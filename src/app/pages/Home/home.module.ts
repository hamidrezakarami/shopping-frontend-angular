import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Ng5SliderModule } from 'ng5-slider';
import { MaterialModule } from 'src/shared/material.module';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { HomeDetailComponent } from './home-detail/home-detail.component';
import { HomeCardComponent } from './home-card/home-card.component';
@NgModule({
  declarations: [
    HomeComponent,
    SearchBarComponent,
    HomeDetailComponent,
    HomeCardComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    HomeRoutingModule,
    Ng5SliderModule
  ],
  providers: [],
})
export class HomeModule {}
