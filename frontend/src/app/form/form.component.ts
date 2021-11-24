import { Component, OnInit, Output } from '@angular/core';

declare var bulmaSlider: any;

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  constructor() { }

  //action: string = "http://ec2-3-239-8-46.compute-1.amazonaws.com/api/pictures";
  action: string = "http://localhost:8080/api/pictures";
  imageUrl: string = "";
  id: string = "";
  submitted: boolean = false;
  files :string[] = []

  ngOnInit(): void {

    setInterval(()=>{
      bulmaSlider.attach()
    },100)
  }

  filesChanged(files: FileList | null)
  {
    if(files == null) return;

    this.files = [];

    for(let i = 0; i < files.length; i++)
      this.files.push(files[i].name);
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
      this.imageUrl = this.action + "/" + this.id;
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
