import { Component, OnInit, Output } from '@angular/core';

declare var bulmaSlider: any;

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  constructor() { }

  action: string = "http://localhost:8080/api/pictures";
  imageUrl: string = "aa";
  id: string = "";
  submitted: boolean = false;

  ngOnInit(): void {

    setInterval(()=>{
      bulmaSlider.attach()
    },100)
  }

  submit() {
    this.submitted = true;
    const form = document.getElementsByTagName('form')[0];
    const data = new FormData(form);

    const xhr = new XMLHttpRequest();

    const self = this;
    xhr.onload = function()
    {
      if(this.status === 200)
      {
        const res = JSON.parse(this.responseText);
        self.id = res.id;
        self.check();
      }
      else
      {
        self.submitted = false;
      }
    }

    xhr.open("post", this.action);
    xhr.send(data);
  }

  copied=false;
  Copied()
  {
    this.copied=true;
  }

  check() {
    // TODO: Check if processing has been completed. Use setTimeout (5000ms) to check until gif is created.
    // TODO: If created set `this.imageUrl` to the gif url.
    console.log("Checking");

  }
}
