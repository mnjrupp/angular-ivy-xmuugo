import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import {PieComponent} from './pie/pie.component';
import {BarComponent} from './bar/bar.component';
import {ScatterComponent} from './scatter/scatter.component';
import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import {FileUploadComponent} from './file-upload/file-upload.component';
import {TableComponent} from './table/table.component';
import {LineChartComponent} from './line-chart/line-chart.component';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  imports:      [ BrowserModule, FormsModule,HttpClientModule],
  declarations: [ AppComponent, HelloComponent,
    PieComponent,BarComponent,ScatterComponent,
    FileUploadComponent,
    TableComponent,
    LineChartComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
