import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { FormComponent } from './form/form.component';
import { CarouselComponent } from './carousel/carousel.component';
import { TermsComponent } from './terms/terms.component';
import { FeaturedComponent } from './featured/featured.component';
import { LoginComponent } from './login/login.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import {FormsModule} from '@angular/forms';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    FormComponent,
    CarouselComponent,
    TermsComponent,
    FeaturedComponent,
    LoginComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    ClipboardModule,
    FormsModule,
    RouterModule.forRoot([
      {path: "", component: HomeComponent},
      {path: "featured", component: FeaturedComponent},
      {path: "eula", component: TermsComponent},
      {path: "login", component: LoginComponent}
    ], { useHash: true })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
