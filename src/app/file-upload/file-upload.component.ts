import { Component, OnInit } from '@angular/core';
import {AppGlobals} from '../app.global';
import {CommonService} from '../common.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {

  constructor(private Service: CommonService) { }

  ngOnInit() {
  }
  onFileUpload(evt: any){
    const target: DataTransfer = <DataTransfer>evt.target;
    if (target.files.length !== 1) {
      throw new Error('Cannot use multiple files');
    }

    const reader: FileReader = new FileReader();
    var file: File = target.files[0];
    reader.onload = (e: any) => {

     AppGlobals.dynData= e.target.result
     console.log("..results from FileUpload");
     console.log(this.Service.csvJSON(AppGlobals.dynData));
    this.sendMessage(AppGlobals.dynData);


    }
    reader.readAsText(file);
  }
  sendMessage(data:any[]): void {
    // send message to subscribers via observable subject
    this.Service.sendUpdate(this.Service.csvJSON(data));
  }
      
}