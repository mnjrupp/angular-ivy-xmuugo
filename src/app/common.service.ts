import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CommonService {
  constructor() {}
  private subjectName = new Subject<any>(); //need to create a subject

  sendUpdate(message: any) {
    //the component that wants to update something, calls this fn
    this.subjectName.next(message); //next() will feed the value in Subject
  }

  getUpdate(): Observable<any> {
    //the receiver component calls this function
    return this.subjectName.asObservable(); //it returns as an observable to which the receiver funtion will subscribe
  }

  public csvJSON(csv) {
    //console.log('..entering cvsJSON with following\n' + csv.toString());
    var lines = csv.toString().split('\n');

    var result = [];

    var headers = lines[0].replace(/[\n\r]/g, "").split(',');

    for (var i = 1; i < lines.length; i++) {
      var obj = {};
      var currentline = lines[i].replace(/[\n\r]/g, "").split(',');

      for (var j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
      }

      result.push(obj);
    }

    //return result; //JavaScript object
    return JSON.stringify(result); //JSON
  }
}
