import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatInputModule} from '@angular/material/input';
import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './auth/login/login.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MaterialModule } from 'src/shared/material.module';
import { MainPageComponent } from './main-page/main-page.component';
import { NavbarComponent } from './main-page/navbar/navbar.component';
import { ToolbarComponent } from './main-page/toolbar/toolbar.component';
import { ProfileDialogComponent } from './main-page/toolbar/profile-dialog/profile-dialog.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Toaster, ToastNotificationsModule } from './core/toast-notification';
import { UserService } from './core/services/user.service';
import { GlobalService } from './core/services/global.service';
import { RequestBuilder } from './core/services/request.service';
import { AuthGuard } from './core/services/auth.guard';
import { HttpErrorInterceptorService } from './core/services/http-error-interceptor.service';
import { CommonModule } from '@angular/common';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { AddProductComponent } from './main-page/toolbar/add-product/add-product.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    LoginComponent,
    MainPageComponent,
    ToolbarComponent,
    NavbarComponent,
    ProfileDialogComponent,
    SignUpComponent,
    AddProductComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    FormsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    HttpClientModule,
    ToastNotificationsModule,
    CommonModule,
  ],
  providers: [
    Toaster,
    UserService,
    GlobalService,
    RequestBuilder,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
  entryComponents: [ProfileDialogComponent],
})
export class AppModule { }
