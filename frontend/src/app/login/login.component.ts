import { CognitoService } from './../../services/cognito.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  validpass : boolean = false;
  registering :boolean = true;
  readytoSubmit :boolean =false;

  email = document.getElementsByName("email")

  constructor(public CogService :CognitoService) {}

  ngOnInit(): void {
  }

  passwordCheck(){
    const pas1 = document.getElementsByTagName("input")[1].value;
    const pas2 = document.getElementsByTagName("input")[2].value;

    if(pas1 == pas2)
      this.validpass = true;
    else
      this.validpass = false;

  }

  ChangeType(){
    if(this.registering)
      this.registering = false;
    else
      this.registering = true;
  }

  dis1=true;
  dis2=true;

  changing1(){
    if(this.email[0] !== null && this.validpass && document.querySelector('#eulacheck:checked') !== null)
      this.dis1 = false;
    else
      this.dis1 = true;
  }

  changing2(){
    if(this.email[1] !== null)
      this.dis2 = false;
    else
      this.dis2 = true;
  }

}
