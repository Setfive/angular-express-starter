import {Component, OnInit} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { IRegisterResponse } from '../services/requestTypes';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  validationError = false;
  serverError = false;

  registerForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.registerForm.controls['email'].valueChanges.subscribe(value => {
      // Remove in use email error if user changes what is in email field.
      this.serverError = false;
    });
  }

  registerUser() {
    if (this.registerForm.valid) {
      this.validationError = false;
      this.serverError = false;
      this.authenticationService
        .registerUser({
          name: this.registerForm.value.name as string,
          email: this.registerForm.value.email as string,
          password: this.registerForm.value.password as string,
        })
        .subscribe((result: IRegisterResponse) => {
          if ('token' in result) {
            // Success case: IRegisterSuccess
            this.serverError = false;
            this.authenticationService.setJwtToken(result.token);
            this.router.navigate(['campaign', 'create']);
          } else {
            // Error case: IRegisterError
            this.serverError = true;
          }
        });
    } else {
      this.serverError = false;
      this.validationError = true;
    }
  }
}
