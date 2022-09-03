import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../services/authentication.service";
import {IProfileResponse} from "../services/requestTypes";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  isAuthenticated = false;
  profile: IProfileResponse | null = null;

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.isAuthenticated = this.authenticationService.isAuthenticated();
    if(this.isAuthenticated) {
      this.authenticationService.profile().subscribe(result => {
        this.profile = result;
      });
    }
  }

}
