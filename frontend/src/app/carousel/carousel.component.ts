import { Component, OnInit } from '@angular/core';
//import bulmaCarousel from 'node_modules/bulma-carousel/dist/js/bulma-carousel.min.js';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit {
  recived = false;
  images :any= [];
  data = [
    "https://img.freepik.com/free-vector/flame-abstract-logo_95982-235.jpg?size=626&ext=jpg",
    "https://img.freepik.com/free-vector/mic-leaf-logo_83874-139.jpg?size=338&ext=jpg",
    "https://img.freepik.com/free-vector/latter-e-fire-color_116762-8.jpg?size=338&ext=jpg",
    "https://img.freepik.com/free-vector/fire-shield-logo_23758-270.jpg?size=338&ext=jpg",
    "https://img.freepik.com/free-vector/fire-water-logo-design_149374-138.jpg?size=338&ext=jpg",
    "https://img.freepik.com/free-vector/flame-abstract-logo_95982-235.jpg?size=626&ext=jpg"
  ]
  constructor() { }

  ngOnInit(): void {
    setTimeout(()=>{
      this.images = this.data;
    }, 3000);
    //setTimeout(()=>{
      //bulmaCarousel.attach('#carousel', {
        //slidesToScroll: 1,
        //slidesToShow: 4
      //});
    //}, 4000);
    
  }

}
