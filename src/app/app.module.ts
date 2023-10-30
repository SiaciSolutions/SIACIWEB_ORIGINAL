import { AdminModule } from './admin/admin.module';
import { StarterModule } from './starter/starter.module';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { ListaComponent } from './lista/lista.component';
import { PanelusuarioComponent } from './panelusuario/panelusuario.component';

import { StarterComponent } from './starter/starter.component';
import { StarterHeaderComponent } from './starter/starter-header/starter-header.component';
import { StarterLeftSideComponent } from './starter/starter-left-side/starter-left-side.component';
import { StarterContentComponent } from './starter/starter-content/starter-content.component';
import { StarterFooterComponent } from './starter/starter-footer/starter-footer.component';
import { StarterControlSidebarComponent } from './starter/starter-control-sidebar/starter-control-sidebar.component';

import { AdminComponent } from './admin/admin.component';
import { AdminHeaderComponent } from './admin/admin-header/admin-header.component';
import { AdminLeftSideComponent } from './admin/admin-left-side/admin-left-side.component';
import { AdminContentComponent } from './admin/admin-content/admin-content.component';
import { AdminFooterComponent } from './admin/admin-footer/admin-footer.component';
import { AdminControlSidebarComponent } from './admin/admin-control-sidebar/admin-control-sidebar.component';
import { AdminDashboard2Component } from './admin/admin-dashboard2/admin-dashboard2.component';
import { NgxImageCompressService } from 'ngx-image-compress';


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
  MatAutocompleteModule
} from '@angular/material';

import { MatPaginatorIntl } from '@angular/material';
import { RutaNoExisteComponent } from './ruta-no-existe/ruta-no-existe.component';
export class MatPaginatorIntlCro extends MatPaginatorIntl {
  itemsPerPageLabel = 'Registros por página';
  nextPageLabel = 'Página siguiente';
  previousPageLabel = 'Página anterior';
  getRangeLabel = function(page, pageSize, length) {
    if (length === 0 || pageSize === 0) {
      return '0 od ' + length;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex =
      startIndex < length
        ? Math.min(startIndex + pageSize, length)
        : startIndex + pageSize;
    return startIndex + 1 + ' - ' + endIndex + ' od ' + length;
  };
}

@NgModule({
  declarations: [
  AppComponent,
  LoginComponent, 
  ListaComponent,
  RutaNoExisteComponent, 
  PanelusuarioComponent,
    // StarterComponent,
	// StarterPedidosComponent,
    // StarterHeaderComponent,
    // StarterLeftSideComponent,
    // StarterContentComponent,
    // StarterFooterComponent,
    // StarterControlSidebarComponent
	
  ],
  imports: [
    AdminModule,
	StarterModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
	ReactiveFormsModule,
    BrowserAnimationsModule,
    AngularFontAwesomeModule,
    HttpClientModule,
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
	MatAutocompleteModule
  ],
  providers: [{provide: MatPaginatorIntl, useClass: MatPaginatorIntlCro},NgxImageCompressService],
  bootstrap: [AppComponent]
})
export class AppModule {}
