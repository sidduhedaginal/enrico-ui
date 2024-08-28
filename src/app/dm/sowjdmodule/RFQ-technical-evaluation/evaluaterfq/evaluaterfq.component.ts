import { Component, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { popupMessageComponent } from 'src/app/popup/popup-message/popup-message.component';
import { sowjdService } from 'src/app/dm/services/sowjdService.service';
import { NotifyService } from 'src/app/dm/services/notify.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-evaluaterfq',
  templateUrl: './evaluaterfq.component.html',
  styleUrls: ['./evaluaterfq.component.scss'],
})
export class EvaluaterfqComponent {
  private sub: any;
  rfqId: any;
  evaluationErrorMessage: string;
  technicalEvaluation: any = [];
  public TechnicalRating: any = [
    { rating: 1 },
    { rating: 2 },
    { rating: 3 },
    { rating: 4 },
    { rating: 5 },
    { rating: 6 },
    { rating: 7 },
    { rating: 8 },
    { rating: 9 },
    { rating: 10 },
    { rating: 'NA' },
  ];
  checked: boolean = false;

  constructor(
    private sowjdService: sowjdService,
    public dialogRef: MatDialogRef<EvaluaterfqComponent>,
    private dialog: MatDialog,
    private notifyservice: NotifyService,
    private loaderService: LoaderService,
    @Inject(MAT_DIALOG_DATA) public data: any = null
  ) {
    this.rfqId = this.data.rfqId;
  }

  ngOnInit(): void {
    this.getTechnicalEvaluationRatings();
  }
  onRadioQuestions(event: any, item: any) {
    item.rating = event.value;
  }

  onClose(data: string) {
    this.dialogRef.close({ data });
  }

  popMessage(title: string, message: string) {
    this.dialog.open(popupMessageComponent, {
      width: '30vw',
      data: {
        title,
        message,
      },
    });
  }

  submitEvaluateRFQ() {
    let technicalEvolutionRatings: any = [];
    this.technicalEvaluation.forEach((questions: any) => {
      technicalEvolutionRatings.push({
        questionId: questions.id,
        remarks: questions.remarks,
        rating: questions.rating === 'NA' ? 0 : questions.rating,
      });
    });

    const ratingsCount = technicalEvolutionRatings.filter(
      (element: any, index: number) => {
        if (element.rating === undefined) {
          return true;
        }
        return false;
      }
    ).length;
    if (ratingsCount > 0) {
      this.popMessage('Check ratings', `Please rate for all RFQ's`);
      return;
    }

    const ratingsCountRemarks = technicalEvolutionRatings.filter(
      (element, index) => {
        if (index === 0 || index === 1) {
          if (element.rating === 0 || element.rating === undefined) {
            if (element.remarks === undefined || element.remarks == '') {
              return true;
            }
            return false;
          }
        }
      }
    ).length;

    if (ratingsCountRemarks > 0) {
      this.popMessage(
        'Check remarks',
        `Please enter remarks for which rating is 'NA' of first/second of RFQ`
      );
      return;
    }

    let technicalEvaluationObj = {
      rfqId: this.rfqId,
      initiateTechnicalProposal: this.checked,
      technicalEvaluationStatusId: 3,
      technicalEvolutionQuestions: technicalEvolutionRatings,
    };

    this.loaderService.setShowLoading();
    this.sowjdService.saveRfqtechEvaluation(technicalEvaluationObj).subscribe(
      (response: any) => {
        if (response.data.isSuccess) {
          this.loaderService.setDisableLoading();
          this.onClose('yes');
          this.notifyservice.alert(response.data.message);
        } else {
          this.loaderService.setDisableLoading();
          this.evaluationErrorMessage = response.data.message;
        }
      },
      (error) => {
        this.loaderService.setDisableLoading();
        this.notifyservice.alert(error.error.data.errorDetails[0].errorCode);
      }
    );
  }

  getTechnicalEvaluationRatings() {
    this.loaderService.setShowLoading();
    this.sowjdService.getTechQuestions().subscribe((res: any) => {
      this.technicalEvaluation = res.data;
      this.loaderService.setDisableLoading();
    });
  }
}
