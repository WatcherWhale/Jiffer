import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { FormComponent } from './form/form.component';
import { CarouselComponent } from './carousel/carousel.component';
import { TermsComponent } from './terms/terms.component';
import { FeaturedComponent } from './featured/featured.component';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    FormComponent,
    CarouselComponent,
    TermsComponent,
    FeaturedComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
