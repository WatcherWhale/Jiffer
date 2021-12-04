import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CognitoService {

  constructor() { }

  cookieChecker(){
    if(document.cookie.indexOf("JifferTokenCookie") !== -1)
      return true
    else
      return false
  }

}
