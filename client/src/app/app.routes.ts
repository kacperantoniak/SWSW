import { Routes } from '@angular/router';
import { MasterDetailComponent } from './components/master-detail/master-detail';
import { NoweWypozyczenieComponent } from './components/nowe-wypozyczenie/nowe-wypozyczenie';
import { WypozyczenieDetailsComponent } from './components/wypozyczenie-details/wypozyczenie-details';
import { LoginComponent } from './components/login/login';

export const routes: Routes = [
  { path: '', component: MasterDetailComponent },
  { path: 'login', component: LoginComponent },
  { path: 'nowe-wypozyczenie', component: NoweWypozyczenieComponent },
  { path: 'wypozyczenia/:id', component: WypozyczenieDetailsComponent },
  { path: '**', redirectTo: '' }
];