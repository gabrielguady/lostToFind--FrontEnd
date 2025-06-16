import {ModelBase} from './model-base';
import {User} from './accounts';

export class FoundItem extends ModelBase{
  title: string;
  description: string;
  date_found: Date;
  is_resolved: boolean;
  category: string;
  city: string;
  user: string | User;
}
