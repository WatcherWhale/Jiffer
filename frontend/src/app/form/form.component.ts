import { Component, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  constructor() { }

  action :string = "http://localhost:8080/api/v1/create";
  bulmaSlider :any = document.getElementById("sliderWithValue")

  ngOnInit(): void {
    document.getElementsByTagName("form")[0].setAttribute("action", this.action)
    this.bulmaSlider.attach();
  }
}
