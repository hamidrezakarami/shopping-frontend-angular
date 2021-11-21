import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './core/services/auth.guard';
import { MainPageComponent } from './main-page/main-page.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { AddProductComponent } from './main-page/toolbar/add-product/add-product.component';

const routes: Routes = [
  {
    path: 'search',
    component: MainPageComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./pages/search-routes.module').then(
            (m) => m.SearchRoutesModule
          ),
      },
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path:"sign-up",
    component:SignUpComponent
  },

  { path: '**', redirectTo: 'search/home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
