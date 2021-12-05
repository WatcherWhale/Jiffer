import { CognitoService } from './../../services/cognito.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-newjif',
  templateUrl: './newjif.component.html',
  styleUrls: ['./newjif.component.css']
})
export class NewjifComponent implements OnInit {

  constructor(public CogService :CognitoService) {
  }

  ngOnInit(): void {
  }


}
