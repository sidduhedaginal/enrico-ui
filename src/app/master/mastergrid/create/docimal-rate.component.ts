import {
  AfterViewInit,
  Component,
  ViewChild,
  ViewContainerRef
} from '@angular/core';

@Component({
  selector: 'app-numeric-editor-cell',
  template: `
    <input
      #i
      [value]="params.value"
      (keydown)="onKeyDown($event)"
      (change)="valuechange($event)"
       style="width: 100%; height: -webkit-fill-available;"
    />
  `
})
export class DocimalRateValidate {
  @ViewChild('i') textInput: any;
  params: any;
  dataValue:any=0;

  agInit(params: any): void {

    if(this.params===undefined){
      this.dataValue=0;
    }
    this.params = params;
  }
  getValue() {
     return this.dataValue ;
  }

  valuechange(event:any){
     if(event.value==undefined){
      this.dataValue=0;
    }
    this.dataValue=event.value;
  }
  onKeyDown(event:any)
  {
   // this.dataValue=this.params.value;
      if (
      event.keyCode === 8 ||
      event.keyCode === 46 ||
      event.keyCode === 37 ||
      event.keyCode === 39
    )
    {
      return true;
    }

    if (event.target.value===undefined){
      this.dataValue=0;
      return false;
    }
    else if (event.target.value.length >= 50)
     {
      event.preventDefault();

      return true;
    }
    if (event.key == '.')
    {
      if (event.target.value.includes('.')) {
        event.preventDefault();
      }
      return true;
    }
    else if (!isNumeric(event)) {
      //event.preventDefault();
      this.params.value=0;
      this.dataValue=0;
      return true;
    }

    else if (event.target.value.includes('.') && event.key != '.')
    {
      let myarr = (event.target.value + event.key).split('.');
      if (myarr[1].length > 3)
      {
        event.preventDefault();
        return false;
      }
      else{
        this.dataValue=event.target.value + event.key;
        return true;
      }

    }
    else{
      this.dataValue=event.target.value + event.key;
            return true;
    }



    function isNumeric(ev:any) {
      return /\d/.test(ev.key);
    }
    return true;
  }
}
