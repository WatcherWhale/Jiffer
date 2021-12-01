import { Component, OnInit } from '@angular/core';
import {ApiService} from '../api.service';

@Component({
  selector: 'app-jiff-list',
  templateUrl: './jiff-list.component.html',
  styleUrls: ['./jiff-list.component.css']
})
export class JiffListComponent implements OnInit {

  constructor(public api : ApiService) { }

  url: string = "";

  gifs: any[] = [];

  async ngOnInit() {
    this.url = this.api.getApi() + "/pictures";

    this.gifs = await this.api.doRequest(this.url) as any[];
    console.log(this.gifs);

    for(const i in this.gifs)
    {
      this.gifs[i]['size'] = this.random();
    }

  }

  random(min: number = 2, max: number = 4) {
    return Math.round(Math.random() * (max - min)) + min;
  }

}
