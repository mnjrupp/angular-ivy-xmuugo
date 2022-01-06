import { Component, OnInit,OnDestroy } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {AppGlobals} from '../app.global';
import { Subscription } from 'rxjs';
import {CommonService} from '../common.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit,OnDestroy {

  private dummyData = [] /*
    {"Framework": "Vue", "Stars": "166443", "Released": "2014"},
    {"Framework": "React", "Stars": "150793", "Released": "2013"},
    {"Framework": "Angular", "Stars": "62342", "Released": "2016"},
    {"Framework": "Backbone", "Stars": "27647", "Released": "2010"},
    {"Framework": "Ember", "Stars": "21471", "Released": "2011"},
  ];*/
  public csvArray: any =[];
  private messageReceived: any[];
  private subscriptionName: Subscription;

  constructor(private Service:CommonService, private http:HttpClient ) {
    this.subscriptionName= this.Service.getUpdate().subscribe
    (message => { //message contains the data sent from service
    this.messageReceived = message ;
    console.log('...table.component Received the following message');
    console.log(message);
   // console.log('.. results after converting');
    console.log(this.messageReceived);
   this.csvArray = JSON.parse(message);
    //this.drawPlot(message);
  });
}
getData(){
  
              this.csvArray=this.dummyData;
           
           // console.log(this.csvArray);
            //AppGlobals.csvData=this.csvArray;
  
      
   }

  ngOnInit() {
    this.getData();
  }
  ngOnDestroy(){
    this.subscriptionName.unsubscribe();
  }

}