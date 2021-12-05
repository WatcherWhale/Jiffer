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
  readytoSubmit :boolean = false;
  dis1 :boolean = true;
  dis2 :boolean = true;

  email = document.getElementsByName("email")

  constructor(public CogService :CognitoService) {}

  ngOnInit(): void {
  }

  passwordCheck(){
    const pas1 = document.getElementsByTagName("input")[1].value;
    const pas2 = document.getElementsByTagName("input")[2].value;

    this.validpass = pas1 == pas2;

  }

  ChangeType(){

    this.registering = !this.registering;

  }

  changing1(){
    if(this.email[0] !== null && this.validpass && document.querySelector('#eulacheck:checked') !== null)
      this.dis1 = false;
    else
      this.dis1 = true;
  }

  changing2(){
    this.dis2 = false;
  }

}
