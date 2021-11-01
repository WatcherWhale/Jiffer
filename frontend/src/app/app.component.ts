import { Component } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  featured=false;
  user=false;
  logOut=false;
  home=true;


  title = 'frontend';

  LogOut = ()=>{
    this.logOut =true;
    this.home=false;
    this.user=false;
    this.featured=false;
  }

  User = ()=>{
    this.user=true;
    this.logOut =false;
    this.home=false;
    this.featured=false;
  }

  Featured =()=>{
    this.featured=true;
    this.logOut =false;
    this.home=false;
    this.user=false;
  }

  Home =()=>{
    this.home=true;
    this.logOut =false;
    this.user=false;
    this.featured=false;
  }
}
