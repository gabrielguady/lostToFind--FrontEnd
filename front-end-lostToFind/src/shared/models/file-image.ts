import {ModelBase} from './model-base';
import {LostItem} from './lost-item';
import {FoundItem} from './found-item';

export class FileImage extends ModelBase{
  remote_name: string;
  lost_item: LostItem;
  found_item: FoundItem;
}
