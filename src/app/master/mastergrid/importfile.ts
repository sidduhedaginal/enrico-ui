import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GridApi } from 'ag-grid-community';
import * as XLSX from 'xlsx';
import { ApiCallService } from '../services/api-call.service';
import { ImportdataService } from '../skillmaster/services/importdata.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoaderService } from '../../../app/services/loader.service';
import { menuId } from '../constants/app-constant';

@Component({
  selector: 'importfile',
  templateUrl: 'popup/importfile.html',
  styleUrls: ['./popup/importfile.scss'],
})
export class importfile {
  private gridApi!: GridApi;
  public columnDefs: any = [];
  public colDefs: any = [];
  public rowData: any = [];
  public routerdata: any;
  showLoading = false;
  fileSelected = false;
  uniqueness = true;
  showError = false;
  filename = '';
  filesize: any ;
  imageUrl =
    'https://colorlib.com/wp-content/uploads/sites/2/jquery-file-upload-scripts.png';
  constructor(
    private router: Router,
    private importdataService: ImportdataService,
    public dialogRef: MatDialogRef<importfile>,
    private apiService: ApiCallService,
    private snackBar: MatSnackBar,
    private loaderService: LoaderService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient
  ) {
    this.routerdata = data;
  }

  handleButtonClick() {
    const fileInput = document.getElementById('file-input');
    fileInput?.click();
  }
  onFileChange(event: any) {
    const target: DataTransfer = <DataTransfer>event.target;
    if (target.files.length !== 1) {
      throw new Error('Cannot use multiple files');
    }
    /// Reading it as excel
    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(target.files[0]);

    const file: File = event.target.files[0];

    var formdata: any = new FormData();
    formdata.append('', file);

    reader.onload = (e: any) => {
      this.filename = file.name;
      
      this.filesize = (file.size/1024).toFixed(2);//file.size;
      const binarystr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);

      if (this.showError == false) this.fileSelected = true;
      this.importdataService.selecteditem(data);
      this.importdataService.selectedFile(event.target.files);
      event.target.value = null;
    };

    // reader  it as part of base64
    const base64Reader: FileReader = new FileReader();
    base64Reader.readAsDataURL(file);
    base64Reader.onload = () => {
      const base64String = base64Reader.result as string;
      const base64Data = base64String.split(',')[1];
      const cleanBase64 = base64Data.replace(/^.*?base64,/, '');

      // this.importdataService.selectedBase64(base64String);
      this.importdataService.selectedBase64(cleanBase64);
    };
  }

  onDrop(event: any) {
    const target: DataTransfer = <DataTransfer>event.target;
    if (target.files.length !== 1) {
      throw new Error('Cannot use multiple files');
    }
    /// Reading it as excel
    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(target.files[0]);
    const file: File = event.target.files[0];
    var formdata: any = new FormData();
    formdata.append('', file);

    reader.onload = (e: any) => {
      this.filename = file.name;
      this.filesize = file.size;
      const binarystr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);

      if (this.showError == false) this.fileSelected = true;
      this.importdataService.selecteditem(data);
      this.importdataService.selectedFile(event.target.files);
    };

    // reader  it as part of base64
    const base64Reader: FileReader = new FileReader();
    base64Reader.readAsDataURL(file);
    base64Reader.onload = () => {
      const base64String = base64Reader.result as string;
      const base64Data = base64String.split(',')[1];
      const cleanBase64 = base64Data.replace(/^.*?base64,/, '');
      // this.importdataService.selectedBase64(base64String);
      this.importdataService.selectedBase64(cleanBase64);
    };
  }
  cancelFile(){
    this.filename = ""
    this.fileSelected = false;
    
  }

  Onsave() {
    // make loader true
    this.loaderService.setShowLoading();

    const insertAndUpdate = 3;

    if (this.routerdata.title == undefined)
      this.routerdata.title = 'Company Master';
    this.apiService
      .post(
        `api/master-data/process-import-file?menuId=${
          menuId[this.routerdata.title]
        }`,
        {
          flag: insertAndUpdate,
          fileName: this.filename,
          fileBase64: this.importdataService.getBase64Format(),
        }
      )
      .subscribe(
        (response: any) => {
          this.importdataService.setProcessApiResponse(response.data);

          if (response.status == 'Record added successfully') {
            this.onNoClick();
            this.router.navigate(['/Import'], {
              state: {
                routerdata: JSON.stringify(this.routerdata.title),
                responsedata: JSON.stringify(response.data),
              },
            });
          } else {
            this.showSnackbar(response.status);
          }
          this.loaderService.setDisableLoading();
        },
        (error) => {
          console.log(error);
          this.loaderService.setDisableLoading();
        }
      );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  downloadTemplate() {
    let receivedBase64String = '';
    let filename = '';
    this.loaderService.setShowLoading();
    this.apiService
      .post(
        `api/master-data/download-template?menuId=${
          menuId[this.routerdata.title]
        }`
      )
      .subscribe(
        (response: any) => {
          filename = response.data.fileName;
          receivedBase64String = response.data.fileBase64;

          const link = document.createElement('a');
          link.href =
            'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' +
            receivedBase64String;
          link.download = filename;
          link.click();
          this.loaderService.setDisableLoading();
        },
        (error) => {
          console.log(error);
          this.loaderService.setDisableLoading();
        }
      );
  }

  showSnackbar(content: string) {
    this.snackBar.open(content, undefined, { duration: 5000 });
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files) {
      this.handleFiles(files);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  handleFiles(files: FileList) {
    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(files[0]);

    const file: File = files[0];

    var formdata: any = new FormData();
    formdata.append('', file);

    reader.onload = (e: any) => {
      this.filename = file.name;
      const binarystr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);

      if (this.showError == false) this.fileSelected = true;
      this.importdataService.selecteditem(data);
      this.importdataService.selectedFile(files);
    };

    // reader  it as part of base64
    const base64Reader: FileReader = new FileReader();
    base64Reader.readAsDataURL(file);
    base64Reader.onload = () => {
      const base64String = base64Reader.result as string;
      const base64Data = base64String.split(',')[1];
      const cleanBase64 = base64Data.replace(/^.*?base64,/, '');
      this.importdataService.selectedBase64(cleanBase64);
    };
  }
}
