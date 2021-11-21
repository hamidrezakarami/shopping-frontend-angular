import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ParamsHandler } from 'src/app/core/params-handler';
import { GlobalService } from 'src/app/core/services/global.service';
import { ApiRequest } from 'src/app/core/services/request.service';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  repassword:string
  password:string
  username:string

  constructor(private router: Router, private gs: GlobalService) {}
  ngOnInit(): void {}
    

  addUserReq(){
    if(this.password == this.repassword)
    {
    let params = new ParamsHandler();
    params.addParam('username', this.username);
    params.addParam('password', this.password);
    params.addParam('roleID', 2);
    this.isUserAndPassValid(params);

    }
  }
  isUserAndPassValid(param: ParamsHandler) {
    ApiRequest('POST')
      .controller('auth')
      .action('register')
      .setBody(param)
      .call(this.gs)
      .subscribe((resp) => {
        console.log(resp);
        if (resp.Success) this.router.navigate(['search/home']);
        else alert(resp.message)
      });
  }
}
