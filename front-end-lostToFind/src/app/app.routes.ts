import { Routes } from '@angular/router';
import {LostItemListComponent} from '../base/lost-list/lost-list.component';
import {FoundItemListComponent} from '../base/found-list/found-list.component';
import {LostItemCreateComponent} from '../base/lost-list/lost-item-create/lost-item-create.component';
import {FoundItemCreateComponent} from '../base/found-list/found-item-create/found-item-create.component';
import {LoginComponent} from '../base/register/login/login.component';
import {SignupComponent} from '../base/register/signup/signup.component';
import {MyitemsComponent} from '../base/myitems/myitems.component';
import {AddPhotoComponent} from '../base/add-photo-lost/add-photo.component';

export const routes: Routes = [

  {path:'lost_item', component: LostItemListComponent},
  {path:'found_item', component: FoundItemListComponent},
  {path: 'lost_item/:action', component: LostItemCreateComponent},
  {path: 'found_item/:action', component: FoundItemCreateComponent},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'my_items', component: MyitemsComponent},
  {path: 'photo', component: AddPhotoComponent}
];
