import { Injectable } from '@angular/core';
import {
  ILoginRequest,
  ILoginResponse, IProfileResponse,
  IRegisterRequest,
  IRegisterResponse,
} from './requestTypes';
import { environment } from '../../environments/environment';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private jwtToken = '';

  constructor(private httpClient: HttpClient) {}

  isAuthenticated(): boolean {
    return this.jwtToken !== '';
  }

  getJwtToken(): string {
    return this.jwtToken;
  }
  setJwtToken(token: string): void {
    this.jwtToken = token;
  }

  profile() {
    return this.httpClient
               .get<IProfileResponse>(`${environment.apiUrl}/api/profile`, this.getAuthenticatedHttpOption());
  }

  registerUser(registrationRequest: IRegisterRequest) {
    return this.httpClient.post<IRegisterResponse>(
      `${environment.apiUrl}/api/register`,
      {
        name: registrationRequest.name,
        email: registrationRequest.email,
        password: registrationRequest.password,
      }
    );
  }

  handleAuthError(err: HttpErrorResponse) {
    alert('Authentication Error!');
  }

  loginUser(loginRequest: ILoginRequest) {
    return this.httpClient.post<ILoginResponse>(
      `${environment.apiUrl}/api/login`,
      {
        email: loginRequest.email,
        password: loginRequest.password,
      }
    );
  }

  getAuthenticatedHttpOption() {
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.getJwtToken(),
    });
    return {
      headers: headers,
    };
  }
}
