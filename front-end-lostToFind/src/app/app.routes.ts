import {Routes} from '@angular/router';
import {LostItemListComponent} from '../base/lost-list/lost-list.component';
import {FoundItemListComponent} from '../base/found-list/found-list.component';
import {LostItemCreateComponent} from '../base/lost-list/lost-item-create/lost-item-create.component';
import {FoundItemCreateComponent} from '../base/found-list/found-item-create/found-item-create.component';
import {LoginComponent} from '../base/register/login/login.component';
import {SignupComponent} from '../base/register/signup/signup.component';
import {AddPhotoComponent} from '../base/add-photo-lost/add-photo.component';
import {HomeComponent} from '../base/home/home.component'
import {UserComponent} from '../base/user/user.component';
import {ItemSectionComponent} from '../base/item-section/item-section.component';
import {LostItemDetailsComponent} from '../base/lost-list/lost-item-details/lost-item-details.component';

export const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'lost_item',
    component: LostItemListComponent,
  },
  {
    path: 'found_item',
    component: FoundItemListComponent,
  },
  {
    path: 'lost_item/:action',
    component: LostItemCreateComponent,
  },
  {
    path: 'lost_item_details/:action',
    component: LostItemDetailsComponent,
  },
  {
    path: 'found_item/:action',
    component: FoundItemCreateComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'photo',
    component: AddPhotoComponent,
  },
  {
    path: 'user',
    component: UserComponent,
  },
  {
    path: 'item-section',
    component: ItemSectionComponent,
  },
];
