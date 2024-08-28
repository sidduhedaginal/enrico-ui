import { Component, OnInit ,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifyService } from '../../services/notify.service';
import { sowjdService } from '../../services/sowjdService.service';

@Component({
  selector: 'lib-cancelform',
  templateUrl: './cancelform.component.html',
  styleUrls: ['./cancelform.component.css']
})
export class CancelformComponent implements OnInit {

  constructor(private sowjdservice : sowjdService,
    private notifyservice : NotifyService,
    public dialogRef: MatDialogRef<CancelformComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {   
  }

  ngOnInit(): void {
  }

}
