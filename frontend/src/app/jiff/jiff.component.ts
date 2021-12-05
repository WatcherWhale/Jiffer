import { Component, Input, OnInit } from '@angular/core';
import {ApiService} from '../api.service';

@Component({
  selector: 'app-jiff',
  templateUrl: './jiff.component.html',
  styleUrls: ['./jiff.component.css']
})
export class JiffComponent implements OnInit {

  @Input("uuid") uuid: string = "";
  @Input("name") name: string = "";
  @Input("carousel") carousel: boolean = false;
  copied : boolean = false;

  constructor(public api : ApiService) { }

  ngOnInit(): void {
  }

}
