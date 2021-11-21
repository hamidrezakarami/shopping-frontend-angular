import { Component, OnInit, Inject } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { LoginResult } from "src/app/core/models/Profile";
import { User } from "src/app/core/models/user-login.model";
import { Page } from "src/app/core/Page";
import { ParamsHandler } from "src/app/core/params-handler";
import { GlobalService } from "src/app/core/services/global.service";
import { ApiRequest } from "src/app/core/services/request.service";


@Component({
  selector: 'app-user-dialog',
  templateUrl: './profile-dialog.component.html',
  styleUrls: ['./profile-dialog.component.scss'],
})
export class ProfileDialogComponent extends Page implements OnInit {
  user: User;
  selectedTab: number = 0;

  formalName = new FormControl();
  userName = new FormControl('', [Validators.required]);
  email = new FormControl('', [Validators.required, Validators.email]);
  cellPhone = new FormControl();

  oldPassword = new FormControl('', [Validators.required]);
  newPassword = new FormControl('', [Validators.required]);
  repeatPassword = new FormControl('', [Validators.required]);
  operationProcess: boolean = false;

  errorDescription: string = null;

  constructor(
    private dialogRef: MatDialogRef<ProfileDialogComponent>,
    private snackBar: MatSnackBar,
    private gs: GlobalService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(null, (error, action, className) => {
      this.snackBar.open(error, action, {
        panelClass: [className],
        duration: 10000,
      });
    });
    this.user = data.User;
  }

  ngOnInit() {
    this.setEditTabValue();
  }
  setEditTabValue() {
    let profile: LoginResult = JSON.parse(localStorage.getItem('currentUser'));
    this.formalName.setValue(profile.FormalName);
    this.userName.setValue(profile.UserName);
    this.email.setValue(profile.Email);
    this.cellPhone.setValue(profile.CellPhone);
  }
  imageProfile() {
    if (this.user.RoleName == 'Administrator')
      return '../../../../assets/Admin.png';
    // return '../../assets/images/Admin.png';
    else if (this.user.RoleName == 'User')
      return '../../assets/images/User.png';
    else return null
  }

  cancelUpdate() {
    if (this.selectedTab == 0) {
      this.dialogRef.close(null);
    } else if (this.selectedTab == 1 || this.selectedTab == 2) {
      this.selectedTab = 0;
    }
  }

  editUser(passwordRef, confirmPasswordRef) {
    this.errorDescription = '';
    if (this.selectedTab == 1) {
      // Edit User
      this.operationProcess = true;
      let paramsHandler = new ParamsHandler();
      paramsHandler.addParam('UserID', this.user.UserID);
      paramsHandler.addParam('FormalName', this.formalName.value);
      paramsHandler.addParam('Email', this.email.value);
      paramsHandler.addParam('CellPhone', this.cellPhone.value);
      paramsHandler.addParam('State', 0);
      paramsHandler.addParam('RoleID', this.user.RoleID);
      ApiRequest('POST', true)
        .controller('user')
        .action('edit')
        .setBody(paramsHandler)
        .call(this.gs)
        .subscribe((resp) => {
          this.operationProcess = false;
          if (resp != null) {
            if (resp['Success'] == true && resp['Message'] == null) {
              let profile: LoginResult = JSON.parse(
                localStorage.getItem('currentUser')
              );
              profile.FormalName = this.formalName.value;
              profile.Email = this.email.value;
              profile.CellPhone = this.cellPhone.value;
              localStorage.setItem('currentUser', JSON.stringify(profile));
              this.dialogRef.close(null);
              this.gs.toaster.open({
                type: 'success',
                duration: 3000,
                caption: '',
                text: 'Done!',
              });
            } else {
              this.errorDescription = resp['Message'];
            }
          }
        });
      // this.userService.EditUser(paramsHandler).subscribe((resp) => {
      // });
    } else if (this.selectedTab == 2) {
      //change password
      this.changePassword(passwordRef, confirmPasswordRef);
    }
  }
  truePass(pass, cPass) {
    document.getElementById('truePass').classList.remove('drawn');
    document.getElementById('trueConfirm').classList.remove('drawn');

    var regexp = new RegExp(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,100})/
    );
    if (regexp.test(pass)) {
      document.getElementById('truePass').classList.add('drawn');
      if (pass == cPass) {
        document.getElementById('trueConfirm').classList.add('drawn');
      }
    }
  }
  trueConfirm(pass, cPass) {
    document.getElementById('truePass').classList.remove('drawn');
    document.getElementById('trueConfirm').classList.remove('drawn');
    var regexp = new RegExp(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,100})/
    );
    if (regexp.test(pass)) {
      document.getElementById('truePass').classList.add('drawn');
      if (pass == cPass) {
        document.getElementById('trueConfirm').classList.add('drawn');
      }
    }
  }
  changePassword(password: any, confirmPassword: any) {
    this.errorDescription = '';
    if (this.selectedTab == 0) {
      this.selectedTab = 2;
    } else if (this.selectedTab == 2) {
      // change password
      var regexp = new RegExp(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,100})/
      );

      if (password == '' && confirmPassword == '') {
        document.getElementById('passLabel').textContent =
          'please enter your password';
        document.getElementById('passLabel').style.color = 'red';
      } else {
        if (!regexp.test(password)) {
          document.getElementById('passLabel').textContent =
            'Not a valid password';
          document.getElementById('passLabel').style.color = 'red';
        } else {
          if (password == confirmPassword) {
            this.operationProcess = true;
            let paramsHandler = new ParamsHandler();
            paramsHandler.addParam('UserName', this.user.UserName);
            paramsHandler.addParam('Password', this.oldPassword.value);
            paramsHandler.addParam('NewPassword', password);
            ApiRequest('POST', true)
              .controller('user')
              .action('changepassword')
              .setBody(paramsHandler)
              .call(this.gs)
              .subscribe((resp) => {
                if (resp['Message']) {
                  this.gs.toaster.open({
                    type: 'success',
                    duration: 3000,
                    caption: '',
                    text: 'Done!',
                  });
                }
                this.operationProcess = false;
                let data = this.parseResponse(resp);
                if (data == null && resp['Message'] == null) {
                  this.dialogRef.close(null);
                } else {
                  document.getElementById('passLabel').textContent = '';
                  this.errorDescription = data.Message;
                }
              });
          } else {
            document.getElementById('passLabel').textContent =
              "Password confirmation doesn't match Password";
            document.getElementById('passLabel').style.color = 'red';
          }
        }
      }
    }
  }
  onTabChanged(event) {
    this.selectedTab = event.index;
  }
  closeDialog() {
    this.dialogRef.close(null);
  }
}
