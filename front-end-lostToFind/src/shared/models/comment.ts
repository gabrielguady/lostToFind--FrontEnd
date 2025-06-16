import {ModelBase} from './model-base';
import {User} from './accounts';

export class CommentItem extends ModelBase{
  user: string | User;
  comment: string | CommentItem;
  lost_item: number;
  find_item: number;
  text: string;
  comments: CommentItem[];
}
