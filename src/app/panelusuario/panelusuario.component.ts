import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterEvent } from '@angular/router';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ApiService } from '../api.service';
import { DataSource } from '@angular/cdk/table';
import { routerNgProbeToken } from '@angular/router/src/router_module';

@Component({
  selector: 'app-panelusuario',
  templateUrl: './panelusuario.component.html',
  styleUrls: ['./panelusuario.component.css']
})
export class PanelusuarioComponent implements OnInit {
  dataSource = new MatTableDataSource([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  // heroes$: Observable<Hero[]>;
  // displayedColumns: string[] = ['fecha', 'clave', 'tipodoc', 'estadodocumento', 'fechaa', 'pdf', 'xml', 'zip'];
  displayedColumns: string[] = ['idfactura', 'fechaemision', 'razonsocial', 'identificacioncomprador', 'secuencialinterno',
  'emailresponsable', 'dircomprador', 'importetotal', 'autorizacionsri', 'estadodocumento', 'descripcionerror',
  'FechaAutorizacion', 'pdf', 'xml', 'zip', 'mail'];
  ruc = '';
  cargando = true;
  tipo_doc = '';
  startDate = new Date();
  f1;
  f2;
  tipos = [
    { tipo: 'Facturas', value: 'facturas' },
    { tipo: 'Retenciones', value: 'retenciones' },
    { tipo: 'Notas de Credito', value: 'notascredito' },
  ];
  tipo = 'facturas';
  empresa;
  constructor(
    private route: ActivatedRoute,
    private srv: ApiService,
    private router: Router
  ) { }

  ngOnInit() {
    this.ruc = this.route.snapshot.paramMap.get('ruc');
    this.empresa = this.route.snapshot.paramMap.get('empresa');
    const datos = {};
    datos['ruc'] = this.ruc;
    datos['codemp'] = this.empresa;
	datos['tipo'] = 'facturas';
	console.log('DENTRO DE PANEL USUARIO')
	console.log(datos)
    this.srv.reporteu(datos).subscribe(data => {
		console.log("LO QUE VIENE DE REPORTE_U")
		console.log(data)
		// data[1]['STATUS_SIACI']
		// console.log(data[1]['tipodoc'])
		
		if (data.length != 0){
			this.tipo_doc = data[0]['tipodoc'] 
		 }
		 else {
			this.tipo_doc = 'no_existe'  
		}
		
		
		// this.tipo_doc = data[1]['tipodoc']
		console.log(this.tipo_doc)
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.cargando = false;
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  salir() {
    this.router.navigate(['/login']);
  }

  buscar() {
    const datos = {};
    datos['ruc'] = this.ruc;
    datos['f1'] = this.f1;
    datos['f2'] = this.f2;
    datos['tipo'] = this.tipo;
    datos['codemp'] = this.empresa;
	
	console.log("LO QUE VA DESDE EL FORMULARIO SEARCH")
	console.log(datos)
	this.cargando = true;
    this.srv.reporteu(datos).subscribe(data => {
		console.log("LO QUE VIENE DE REPORTE_U EN SEARCH")
		console.log(data)
		this.cargando = false;

		 
		 
		 if (data.length != 0){
			 
			this.tipo_doc = data[0]['tipodoc'] 
		 }
		 else {
			this.tipo_doc = 'no_existe'  
			 
		 }

		console.log(this.tipo_doc)
		
		if (this.tipo_doc == 'factura'){
		this.displayedColumns =['idfactura', 'fechaemision', 'razonsocial', 'identificacioncomprador', 'secuencialinterno',
  'emailresponsable', 'dircomprador', 'importetotal', 'autorizacionsri', 'estadodocumento', 'descripcionerror',
  'FechaAutorizacion', 'pdf', 'xml', 'zip', 'mail'];
		}
		
		
		if (this.tipo_doc == 'retencion'){
		this.displayedColumns = ['idretencion', 'fechaemision', 'razonsocial', 'identificacionproveedor', 'secuencialinterno',
  'emailresponsable', 'dirsujetoretenido', 'totalretencion', 'autorizacionsri', 'estadodocumento', 'descripcionerror',
  'FechaAutorizacion', 'pdf', 'xml', 'zip', 'mail'];
			
		}
		
		if (this.tipo_doc == 'nota de credito'){
		this.displayedColumns = ['idnotacredito', 'fechaemision', 'razonsocial', 'identificacioncomprador', 'secuencialinterno',
  'emailresponsable', 'ValorModificacion', 'autorizacionsri', 'estadodocumento', 'descripcionerror',
  'FechaAutorizacion', 'pdf', 'xml', 'zip', 'mail'];
			
		}
		
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.cargando = false;
    });
  }
}
