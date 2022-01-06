import { HttpClient } from '@angular/common/http';
//import * as csvFile from './assets/frameworks.csv';

export class AppGlobals {
  public static dynData: any;
  public static jsonData = [
    { Framework: 'Vue', Stars: '166443', Released: '2014' },
    { Framework: 'React', Stars: '150793', Released: '2013' },
    { Framework: 'Angular', Stars: '62342', Released: '2016' },
    { Framework: 'Backbone', Stars: '27647', Released: '2010' },
    { Framework: 'Ember', Stars: '21471', Released: '2011' },
  ];

  //dynData = AppGlobals.jsonData;

  // public static csvDataSet:any = csvFile ;

  constructor(private http: HttpClient) {
    this.http
      .get('./assets/frameworks.csv', { responseType: 'text' })
      .subscribe((data) => {
        AppGlobals.dynData = data;
        console.log(AppGlobals.dynData);
      });
  }
}
