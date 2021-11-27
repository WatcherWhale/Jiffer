import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-jiff',
  templateUrl: './jiff.component.html',
  styleUrls: ['./jiff.component.css']
})
export class JiffComponent implements OnInit {

  uuid: string = "";
  name: string = "";

  constructor() { }

  ngOnInit(): void {
    this.uuid = window.location.hash.substring("#/jiff/".length);
  }

}
