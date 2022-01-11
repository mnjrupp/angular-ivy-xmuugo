import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
//import 'rxjs/add/operator/toPromise';
import { CommonService } from '../common.service';
import * as d3 from 'd3';


@Component({
  selector: 'app-line-chart-2',
  templateUrl: './line-chart-2.component.html',
  styleUrls: ['./line-chart-2.component.css']
})
export class LineChart2Component implements OnInit,OnDestroy {

  private messageReceived: any[];
  private subscriptionName: Subscription;
  private svg;
  private margin = { top: 10, right: 30, bottom: 30, left: 60 };
  private width = 460 - this.margin.left - this.margin.right;
  private height = 400 - this.margin.top - this.margin.bottom;

  constructor(private Service: CommonService) {
    this.subscriptionName = this.Service.getUpdate().subscribe((message) => {
      //message contains the data sent from service
      this.messageReceived = message;
      console.log('...line-chart2 component received the following message');
      //console.log(message);
      // console.log('.. results after converting');
      // console.log(JSON.stringify(this.messageReceived));
      var parsedD = JSON.parse(message);
      //console.log(message);
      //this.drawLineChart(message);

    });
    }


    ngOnInit() {
      //this.createSvg();
      //parse data from a csv
      //this.drawLineChart(this.messageReceived);
    }
    ngOnDestroy() {
      this.subscriptionName.unsubscribe();
    }

    createSvg(){
      try{
      const width = 960;
      const height = 500;
      const margin = 5;
      const padding = 5;
      const adj = 30;
      // we are appending SVG first
      const svg = d3.select("div#line").append("svg")
          .attr("preserveAspectRatio", "xMinYMin meet")
          .attr("viewBox", "-"
                + adj + " -"
                + adj + " "
                + (width + adj *3) + " "
                + (height + adj*3))
          .style("padding", padding)
          .style("margin", margin)
          .classed("svg-content", true);
      }catch(e){
        console.log(e);
      }
          }
drawLineChart(data){
      //------------------------1. PREPARATION------------------------//
//-----------------------------SVG------------------------------//
const width = 960;
const height = 500;
const margin = 5;
const padding = 5;
const adj = 30;
 var slices;
// we are appending SVG first
try{
const svg = d3.select("div#line").append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "-"
          + adj + " -"
          + adj + " "
          + (width + adj *3) + " "
          + (height + adj*3))
    .style("padding", padding)
    .style("margin", margin)
    .classed("svg-content", true);

//-----------------------------DATA-----------------------------//
const timeConv = d3.timeParse("%d-%b-%Y");
const dataset = JSON.parse(data) // d3.json(data);
console.log(dataset.length);
//dataset.toPromise().then(function(data) {
  /*   slices = data.columns.slice(1).map(function(id) {
        return {
            id: id,
            values: data.map(function(d){
                return {
                    date: timeConv(d.PaymentDate),
                    measurement: +d[id]
                };
            })
        };
    });
   */     

//----------------------------SCALES----------------------------//
const xScale = d3.scaleTime().range([0,width]);
const yScale = d3.scaleLinear().rangeRound([height, 0]);
xScale.domain(d3.extent(data, function(d){
    return timeConv(d.PaymentDate)}));

yScale.domain([(0), d3.max(data, function (d) {
    return +d.CumulativeInterest;
  })
    ]);

//-----------------------------AXES-----------------------------//
const yaxis = d3.axisLeft()
    .ticks(dataset.length)
    .scale(yScale);

const xaxis = d3.axisBottom()
    .ticks(d3.timeDay.every(1))
    .tickFormat(d3.timeFormat('%b %d'))
    .scale(xScale);

//----------------------------LINES-----------------------------//
const line = d3.line()
    .x(function(d) { console.log(timeConv(d.PaymentDate));return xScale(timeConv(d.PaymentDate)); })
    .y(function(d) { return yScale(+d.CumulativeInterest); });

let id = 0;
const ids = function () {
    return "line-"+id++;
}  

//---------------------------TOOLTIP----------------------------//
const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("position", "absolute");

//-------------------------2. DRAWING---------------------------//
//-----------------------------AXES-----------------------------//
svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xaxis);

svg.append("g")
    .attr("class", "axis")
    .call(yaxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("dy", ".75em")
    .attr("y", 6)
    .style("text-anchor", "end")
    .text("Frequency");

//----------------------------LINES-----------------------------//
const lines = svg.selectAll("lines")
    .data(dataset)
    .enter()
    .append("g");

lines.append("path")
    .attr("class", ids)
    .attr("d", function(d) { return line(d); });

lines.append("text")
    .attr("class","serie_label")
    .datum(dataset)
    .attr("transform", function(d) {
            return "translate(" + (xScale(timeConv(d.PaymentDate)) + 10)  
            + "," + (yScale(+d.CumulativeInterest) + 5 )+ ")"; })
    .attr("x", 5)
    .text(function(d) { return ("Serie ") + d.id; });

//---------------------------POINTS-----------------------------// 
lines.selectAll("points")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("cx", function(d) { return xScale(timeConv(d.PaymentDate)); })      
    .attr("cy", function(d) { return yScale(+d.CumulativeInterest); })    
    .attr("r", 1)
    .attr("class","point")
    .style("opacity", 1);

//---------------------------EVENTS-----------------------------//    
lines.selectAll("circles")
    .data(dataset )
    .enter()
    .append("circle")
    .attr("cx", function(d) { return xScale(timeConv(d.PaymentDate)); })      
    .attr("cy", function(d) { return yScale(+d.CumulativeInterest); })    
    .attr('r', 10)
    .style("opacity", 0)
    .on('mouseover', function(d) {
        tooltip.transition()
            .delay(30)
            .duration(200)
            .style("opacity", 1);

        tooltip.html(d.CumulativeInterest)
            .style("left", (d3.event.pageX + 25) + "px")
            .style("top", (d3.event.pageY) + "px");

        const selection = d3.select(this).raise();

        selection
            .transition()
            .delay("20")
            .duration("200")
            .attr("r", 6)
            .style("opacity", 1)
            .style("fill","#ed3700");
    })                
    .on("mouseout", function(d) {      
        tooltip.transition()        
            .duration(100)      
            .style("opacity", 0);  

        const selection = d3.select(this);

        selection
            .transition()
            .delay("20")
            .duration("200")
            .attr("r", 10)
            .style("opacity", 0);
    });

//});
}catch(e){
  console.log(e);
}
    }
 
}