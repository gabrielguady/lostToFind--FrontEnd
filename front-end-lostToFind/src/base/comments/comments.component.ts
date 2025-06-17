import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {URLS} from '../../shared/urls';
import {DatePipe} from '@angular/common';
import {BaseComponent} from '../base.component';
import {ToastrService} from 'ngx-toastr';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommentItem} from '../../shared/models/comment';
import {MatFormFieldModule} from '@angular/material/form-field';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {MatIconButton} from '@angular/material/button';
import {MatDialog} from '@angular/material/dialog';

const BASE_OPTIONS = {
  url: URLS.COMMENT,
  paramsOnInit: {
    expand: ['user', 'comment', 'comment.user']
  }
}

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [
    DatePipe,
    ReactiveFormsModule,
    MatFormFieldModule,
    CdkTextareaAutosize,
    MatIconButton
  ],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss'
})
export class CommentsComponent extends BaseComponent<CommentItem> implements OnInit {

  @Input() itemId: number;
  @Input() type: 'lost' | 'find';
  @Input() comment?: number;
  public dataSource: CommentItem[] = [];

  constructor(
    http: HttpClient,
    toast: ToastrService,
    activatedRoute: ActivatedRoute,
    dialog: MatDialog,
  ) {
    super(http, BASE_OPTIONS, toast, activatedRoute, dialog);
  }

  public override ngOnInit(): void {
    super.ngOnInit(() => {
      this.search();
    });
  }

  public override createFormGroup(): void {
    this.formGroup = new FormGroup({
      text: new FormControl(null, [Validators.required]),
      lost_item: new FormControl(null),
      find_item: new FormControl(null),
      comment: new FormControl(null),
    });
  }

  public search(resetIndex: boolean = false): void {
    this.service.clearParameter();
    if (this.type == 'lost') {
      this.service.addParameter('lost_item', this.itemId);
    } else if (this.type == 'find') {
      this.service.addParameter('find_item', this.itemId);
    }
    this.service.addParameter('expand', ['user', 'comment', 'comment.user']);
    this.service.getAll().subscribe({
      next: (data: CommentItem[]) => {
        this.dataSource = data;
      },
      error: (error) => {
        console.error('error loading Lost Item: ');
      }
    });
  }

  public scrollToBottom(): void {
    const el = document.getElementById('comments_list');
    el.scrollTop = el.scrollHeight+2;
  }


  override saveOrUpdateForm() {
    if(this.type === 'lost'){
      this.formGroup.get('lost_item')?.setValue(this.itemId);
    }else {
      this.formGroup.get('find_item')?.setValue(this.itemId);
    }
    if(this.comment) {
      this.formGroup.get('comment')?.setValue(this.comment);
    }
    super.saveOrUpdateForm(() => {
      this.object = new CommentItem();
      this.formGroup.reset();
      this.search(true);
    });
  }

}
