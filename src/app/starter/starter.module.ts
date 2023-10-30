import { StarterRoutingModule } from './starter-routing/starter-routing.module';
import { StarterControlSidebarComponent } from './starter-control-sidebar/starter-control-sidebar.component';
import { StarterFooterComponent } from './starter-footer/starter-footer.component';
import { StarterContentComponent } from './starter-content/starter-content.component';
import { StarterLeftSideComponent } from './starter-left-side/starter-left-side.component';
import { StarterHeaderComponent } from './starter-header/starter-header.component';
import { StarterPedidosComponent } from './starter-pedidos/starter-pedidos.component';


// import { AdminDashboard1Component } from './admin-dashboard1/admin-dashboard1.component';
// import { AdminControlSidebarComponent } from './admin-control-sidebar/admin-control-sidebar.component';
// import { AdminFooterComponent } from './admin-footer/admin-footer.component';
// import { AdminContentComponent } from './admin-content/admin-content.component';
// import { AdminLeftSideComponent } from './admin-left-side/admin-left-side.component';
// import { AdminHeaderComponent } from './admin-header/admin-header.component';
import { StarterComponent } from './starter.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  MatCardModule,
  MatInputModule,
  MatButtonModule,
  MatTableModule,
  MatToolbarModule,
  MatIconModule,
  MatPaginatorModule,
  MatSortModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatSelectModule,
  MatCheckboxModule,
  MatListModule,
  MatAutocompleteModule
} from '@angular/material';





@NgModule({
  imports: [
	  BrowserModule,
      BrowserAnimationsModule,
      MatAutocompleteModule,
      MatInputModule,
      FormsModule,
      ReactiveFormsModule,
	  MatSelectModule,
	  MatCheckboxModule,
	  MatListModule,
  
    CommonModule,
    StarterRoutingModule
  ],
  declarations: [
    StarterComponent,
    StarterHeaderComponent,
    StarterLeftSideComponent,
    StarterContentComponent,
    StarterFooterComponent,
    StarterControlSidebarComponent,
    StarterPedidosComponent
  ],
  exports: [StarterComponent]
})
export class StarterModule { }
