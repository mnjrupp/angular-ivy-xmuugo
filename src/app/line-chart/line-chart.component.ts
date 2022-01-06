import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonService } from '../common.service';
import * as d3 from 'd3';


@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css'],
})
export class LineChartComponent implements OnInit, OnDestroy {
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
    this.drawLineChart(this.messageReceived);
  }
  ngOnDestroy() {
    this.subscriptionName.unsubscribe();
  }

  drawLineChart(data: any[]) {
    const timeConv = d3.timeParse('%m/%d/%Y');
    // This allows to find the closest X index of the mouse:
    const bisect = d3.bisector(function(d) { return d.x; }).left;

    try {
  
      // Add X axis --> it is a date format
      console.log('  inside darawLineChart');
      var x = d3
        .scaleTime()
        .domain(
          d3.extent(data, function (d) {
            //console.log(timeConv(d.PaymentDate));
            return timeConv(d.PaymentDate);
          })
        )
        .range([0, this.width]);
      this.svg
        .append('g')
        .attr('transform', 'translate(0,' + this.height + ')')
        .call(d3.axisBottom(x));

      // Add Y axis
      var y = d3
        .scaleLinear()
        .domain([
          0,
          d3.max(data, function (d) {
            return +d.CumulativeInterest;
          }),
        ])
        .range([this.height, 0]);
      this.svg.append('g').call(d3.axisLeft(y));
      //console.log('..max Cumulative Interest = ' + d3.max(data, function(d) { return +d.CumulativeInterest; }));
      // Add the line
      this.svg
        .append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 1.5)
        .attr(
          'd',
          d3
            .line()
            .x(function (d) {
              return x(timeConv(d.PaymentDate));
            })
            .y(function (d) {
              return y(+d.CumulativeInterest);
            })
        );
                // Create the circle that travels along the curve of chart
        var focus = this.svg
        .append('g')
        .append('circle')
          .style("fill", "none")
          .attr("stroke", "black")
          .attr('r', 8.5)
          .style("opacity", 0)

      // Create the text that travels along the curve of chart
      var focusText = this.svg
        .append('g')
        .append('text')
          .style("opacity", 0)
          .attr("text-anchor", "left")
          .attr("alignment-baseline", "middle")

          // Create a rect on top of the svg area: this rectangle recovers mouse position
  this.svg
  .append('rect')
  .style("fill", "none")
  .style("pointer-events", "all")
  .attr('width', this.width)
  .attr('height', this.height)
  .on('mouseover', mouseover)
  .on('mousemove', mousemove)
  .on('mouseout', mouseout);


// What happens when the mouse move -> show the annotations at the right positions.
function mouseover() {
  focus.style("opacity", 1)
  focusText.style("opacity",1)
}

function mousemove() {
  // recover coordinate we need
  var x0 = x.invert(d3.pointer(event)[0]);
  var y0 = y.invert(d3.pointer(event)[0])
  var i = bisect(data, y0,1);
  var bd = d3.bisector(function(d) {
    return d.PaymentDate;
  }).left;
  //var i = bd(data,timeConv(x0));
  //console.log(data[0]);
 
  var selectedData = data[i]
 
  focus
    .attr("cx", x(selectedData.x))
    .attr("cy", y(selectedData.y))
  focusText
    .html("x:" + selectedData.x + "  -  " + "y:" + selectedData.y)
    .attr("x", x(selectedData.x)+15)
    .attr("y", y(selectedData.y))
  }
function mouseout() {
  focus.style("opacity", 0)
  focusText.style("opacity", 0)
}

    } catch (e) {
      console.log(e);
    }
  }

  // append the svg object to the body of the page
  private createSvg(): void {
    this.svg = d3
      .select('figure#line')
      .append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr(
        'transform',
        'translate(' + this.margin.left + ',' + this.margin.top + ')'
      );
      
  }

}
