import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogContent, MatDialogRef} from '@angular/material/dialog';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatToolbar} from '@angular/material/toolbar';

export interface DialogData {
  title: string;
  message: string;
  description: string;
  confirmationButton?: string;
  cancel?: string;
}

@Component({
  selector: 'app-dialog',
  templateUrl: './delete-confirm-dialog.component.html',
  styleUrls: ['./delete-confirm-dialog.component.scss'],
  standalone: true,
  imports: [
    MatDialogContent,
    MatButton,
    MatIcon,
    MatIconButton,
    MatToolbar
  ]
})
export class DeleteConfirmDialogComponent {
  public constructor(
    public dialogRef: MatDialogRef<DeleteConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
  }

  public close(confirm: boolean): void {
    this.dialogRef.close(confirm);
  }
}
