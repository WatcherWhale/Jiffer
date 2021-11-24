import { Component, OnInit, Output } from '@angular/core';

declare var bulmaSlider: any;

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  constructor() { }

  action: string = "";
  imageUrl: string = "";
  id: string = "";
  submitted: boolean = false;

  ngOnInit(): void {

    this.action = window.location.protocol + "//" + window.location.host + "/api/pictures";
    console.log(this.action)

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
        self.id = res.uuid;
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

  async check() {
    console.log("Checking");

    if(await this.requestUrl())
    {
      this.imageUrl = window.location.protocol + "//" + window.location.host + "/jiff/" + this.id + ".gif";
    }
    else
    {
      setTimeout(() => this.check(), 10000);
    }
  }

  requestUrl()
  {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function()
      {
        resolve(this.status == 200);
      };

      xhr.open("get", this.action + "/" + this.id + "?status=true");
      xhr.send();
    });
  }
}
