import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {ApiService} from '../api.service';

@Component({
  selector: 'app-jiff',
  templateUrl: './jiff.component.html',
  styleUrls: ['./jiff.component.css']
})
export class JiffComponent implements OnInit {

  uuid: string = "";
  name: string = "";

  constructor(public api : ApiService, private router : Router) { }

  ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.uuid = window.location.hash.substring("#/jiff/".length);
  }

}
