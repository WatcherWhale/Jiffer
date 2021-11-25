import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { FormComponent } from './form/form.component';
import { CarouselComponent } from './carousel/carousel.component';
import { TermsComponent } from './terms/terms.component';
import { FeaturedComponent } from './featured/featured.component';
import { LoginComponent } from './login/login.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import {FormsModule} from '@angular/forms';

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
    BrowserModule,
    ClipboardModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
