import { CognitoService } from './../../services/cognito.service';
import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  validpass : boolean = false;
  registering :boolean = false;
  readytoSubmit :boolean = false;
  dis1 :boolean = true;
  dis2 :boolean = true;
  checkSend : any;
  checkError: any;

  email = document.getElementsByName("email")

  constructor(public CogService: CognitoService, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
  }

  submit() {
    const form = document.getElementsByTagName('form')[0];
    const data = new FormData(form);

    this.http.post(form.action, data).subscribe(
      (result) => {
        this.router.navigate(['/']);
        this.checkSend = result;
      },
      (error) => {
        console.log(error)
        this.checkError = error;
      }
    );
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
