import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../services/api.service';

@Component({
  selector: 'app-jiff-list',
  templateUrl: './jiff-list.component.html',
  styleUrls: ['./jiff-list.component.css']
})
export class JiffListComponent implements OnInit {

  constructor(public api : ApiService) { }

  url: string = "";

  gifs: any[] = [];
  tiles: any[][] = [[],[],[],[]]

  async ngOnInit() {
    this.url = this.api.getApi() + "/pictures";

    this.gifs = await this.api.doRequest(this.url) as any[];
    this.gifs = this.gifs.sort((a,b) => Math.random() * 100 - 50);

    for(let i = 0; i < this.gifs.length; i++)
    {
      const gif = this.gifs[i];
      this.tiles[i % 4].push(gif);
    }

  }
}
