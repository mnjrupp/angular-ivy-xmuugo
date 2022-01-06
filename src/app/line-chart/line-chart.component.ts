import { Component, OnInit,OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import {CommonService} from '../common.service';
import * as d3 from 'd3';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit,OnDestroy {

  private messageReceived: any[];
  private subscriptionName: Subscription;

  constructor(private Service:CommonService) { 
    this.subscriptionName= this.Service.getUpdate().subscribe
    (message => { //message contains the data sent from service
    this.messageReceived = message ;
    console.log('...line-chart component received the following message');
    //console.log(message);
   // console.log('.. results after converting');
   // console.log(JSON.stringify(this.messageReceived));
   var parsedD = JSON.parse(message);

  });
  }

  ngOnInit() {
  }
  ngOnDestroy(){

  }

}