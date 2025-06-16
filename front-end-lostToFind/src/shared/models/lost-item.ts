import {ModelBase} from './model-base';
import {ItemCategory} from './item-category';
import {User} from './accounts';

export class LostItem extends ModelBase{
  title: string;
  last_seen_details: string;
  reward : string;
  date_lost : Date;
  is_resolved: boolean;
  category: ItemCategory;
  city: string;
  user: string | User;
}
