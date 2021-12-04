import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CognitoService {

  constructor() { }

  cookieChecker(){

    return document.cookie.indexOf("JifferTokenCookie") !== -1
    
  }

}
