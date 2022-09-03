import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  validationError = false;
  serverError = false;
  serverErrorMessage = '';

  loginForm = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  constructor(
    private httpClient: HttpClient,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  onLogin() {
    if (this.loginForm.valid) {
      this.validationError = false;
      this.serverError = false;
      this.authenticationService
        .loginUser({
          email: this.loginForm.value.email as string,
          password: this.loginForm.value.password as string,
        })
        .subscribe({
          next: result => {
            this.authenticationService.setJwtToken(result.token);
            this.router.navigate(['campaign', 'create']);
          },
          error: err => {
            this.serverErrorMessage =
              err.status === 401
                ? 'Invalid email address or password'
                : 'Server login error';

            this.serverError = true;
          },
        });
    } else {
      this.validationError = true;
    }
  }
}
