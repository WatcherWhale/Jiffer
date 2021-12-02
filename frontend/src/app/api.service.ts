import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor() { }

  public getHost()
  {
    return  window.location.protocol + "//" + window.location.host;
  }

  public getApi()
  {
    return this.getHost() + "/api"
  }

  public doRequest(url : string)
  {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      const self = this;
      xhr.onload = function()
      {
        if(this.status === 200)
        {
          const res = JSON.parse(this.responseText);
          resolve(res);
        }
        else
        {
          resolve(null);
        }
      }

      xhr.open("get", url);
      xhr.send();
    });
  }
}
