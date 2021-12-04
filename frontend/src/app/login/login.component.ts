import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  validemail :boolean = true;
  registering :boolean = true;

  constructor() {}

  ngOnInit(): void {
  }

  mailcheck(){
    const email = document.getElementsByTagName("input")[0].value;
    if(email.includes("@"))
      this.validemail=true;
    else
      this.validemail=false;
  }

  ChangeType(){
    if(this.registering)
      this.registering = false;
    else
      this.registering =true;
  }

}
