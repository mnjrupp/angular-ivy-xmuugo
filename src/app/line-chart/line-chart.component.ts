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
  private svg;
  private  margin = {top: 10, right: 30, bottom: 30, left: 60};
  private width = 460 - this.margin.left - this.margin.right;
  private height = 400 - this.margin.top - this.margin.bottom;

  constructor(private Service:CommonService) { 
    this.subscriptionName= this.Service.getUpdate().subscribe
    (message => { //message contains the data sent from service
    this.messageReceived = message ;
    console.log('...line-chart component received the following message');
    //console.log(message);
   // console.log('.. results after converting');
   // console.log(JSON.stringify(this.messageReceived));
   var parsedD = JSON.parse(message);
   this.drawLineChart(parsedD);

  });
  }

  ngOnInit() {
    this.createSvg();
    //parse data from a csv
   d3.json(this.messageReceived).then(data => this.drawLineChart(data));
  }
  ngOnDestroy(){
    this.subscriptionName.unsubscribe();
  }

  drawLineChart(data:any[]){

    
      // Add X axis --> it is a date format
      var x = d3.scaleTime()
        .domain(d3.extent(data, function(d) { return d.PaymentDate; }))
        .range([ 0, this.width ]);
      this.svg.append("g")
        .attr("transform", "translate(0," + this.height + ")")
        .call(d3.axisBottom(x));
  
      // Add Y axis
      var y = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return +d.CumulativeInterest; })])
        .range([ this.height, 0 ]);
      this.svg.append("g")
        .call(d3.axisLeft(y));
  
      // Add the line
      this.svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
          .x(function(d) { return x(d.PaymentDate) })
          .y(function(d) { return y(d.CumulativeInterest) }))
          
  

  }

    

// append the svg object to the body of the page
private createSvg(): void {
 
this.svg = d3.select("#figure#line")
  .append("svg")
    .attr("width", this.width + this.margin.left + this.margin.right)
    .attr("height", this.height + this.margin.top + this.margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + this.margin.left + "," + this.margin.top + ")");
  }

}