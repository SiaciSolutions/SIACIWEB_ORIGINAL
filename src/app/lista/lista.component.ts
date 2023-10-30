import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterEvent } from '@angular/router';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ApiService } from '../api.service';
import { DataSource } from '@angular/cdk/table';
import { routerNgProbeToken } from '@angular/router/src/router_module';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent implements OnInit {
  dataSource = new MatTableDataSource([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  // heroes$: Observable<Hero[]>;
  displayedColumns: string[] = ['fecha', 'clave', 'tipodoc', 'estadodocumento', 'fechaa', 'pdf', 'xml', 'zip'];
  // displayedColumns: string[] = ['idfactura', 'fechaemision', 'razonsocial', 'identificacioncomprador', 'secuencialinterno',
  // 'emailresponsable', 'dircomprador', 'importetotal', 'autorizacionsri', 'estadodocumento', 'descripcionerror',
  // 'FechaAutorizacion', 'claveacceso', 'codigodocumento', 'pdf', 'xml', 'zip'];
  ruc = '';
  cargando = true;
  startDate = new Date();
  f1;
  f2;
  constructor(
    private route: ActivatedRoute,
    private srv: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.ruc = this.route.snapshot.paramMap.get('ruc');
    const datos = {};
    datos['ruc'] = this.ruc;
    this.srv.reporte(datos).subscribe(
	
	data => {
		console.log("RESULTADO")
		console.log(data)
		if (data.length ===0){
			alert("El identificador ingresado no se encuentra registrado en SIACI");
			this.router.navigate(['/login']);
		}else{
			this.dataSource = new MatTableDataSource(data);
			this.dataSource.paginator = this.paginator;
			this.dataSource.sort = this.sort;
			this.cargando = false;
			
			
		}

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
	this.cargando = true;
    this.srv.reporte(datos).subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.cargando = false;
    });
  }
}
