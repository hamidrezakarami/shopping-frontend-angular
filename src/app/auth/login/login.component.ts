import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ParamsHandler } from 'src/app/core/params-handler';
import { GlobalService } from 'src/app/core/services/global.service';
import { ApiRequest } from 'src/app/core/services/request.service';
import { FormBuilder } from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  login: boolean;

  loginForm = this.formbuilder.group({
    user: ['', Validators.required],
    password: ['', Validators.required],
  });
  errors = errorMessages;
  constructor(
    private router: Router,
    private gs: GlobalService,
    private formbuilder: FormBuilder
  ) {}
  ngOnInit(): void {}

  usernameFormController = new FormControl('', [Validators.required]);

  loginReq() {
    let params = new ParamsHandler();
    params.addParam('username', this.loginForm.get('user').value);
    params.addParam('password', this.loginForm.get('password').value);
    this.isUserAndPassValid(params);
  }

  isUserAndPassValid(param: ParamsHandler) {
    ApiRequest('POST')
      .controller('auth')
      .action('login')
      .setBody(param)
      .call(this.gs)
      .subscribe(
        (resp) => {
          if (resp.accessToken) {
            localStorage.setItem('jwt', resp.accessToken);
            this.router.navigate(['search/home']);
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }
}
export const errorMessages: { [key: string]: string } = {
  name: 'write Name',
  category: 'Please choose at least ONE category',
  price: 'Write IT',
  amount: '1 2 ...',
};
