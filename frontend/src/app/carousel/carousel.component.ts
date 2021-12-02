import { Component, OnInit } from '@angular/core';
import {ApiService} from '../api.service';

declare var bulmaCarousel: any;

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit {
  recieved = false;
  images: any[] = []
  constructor(public api : ApiService) { }

  async ngOnInit() {
    this.images = await this.api.doRequest(this.api.getApi() + "/pictures/?featured=1") as any[];

    let toShow = this.images.length - 1;
    if(toShow > 3) toShow = 3;
    if(toShow <= 0) toShow = 0;


    setInterval(()=>{
      bulmaCarousel.attach('.carousel', {
      slidesToScroll: 1,
      infinite: true,
      slidesToShow: toShow,
      autoplay: true,
      pagination: false
    });
    },100)
  }
}
