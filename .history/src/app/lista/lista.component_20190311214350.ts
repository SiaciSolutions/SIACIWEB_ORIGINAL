import { Component, OnInit , ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {MatPaginator, MatTableDataSource, MatSort} from '@angular/material';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ApiService } from '../api.service';
import { timingSafeEqual } from 'crypto';
import { DataSource } from '@angular/cdk/table';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent implements OnInit {
dataSource = new MatTableDataSource([
  // {'fecha' : '12-12-2018', 'clave': '12345656787890309403940394034903490349304', 'tipodoc': 'facctura', 'pdf': 'pdf', 'xml': 'xml' },
  // {'fecha' : '12-12-2019', 'clave': '12345656787890309403940394034903490349304', 'tipodoc': 'retencion', 'pdf': 'pdf1', 'xml': 'xml1' },
  // {'fecha' : '12-12-2019', 'clave': '12345656787890309403940394034903490349304', 'tipodoc': 'retencion', 'pdf': 'pdf1', 'xml': 'xml1' },
  // {'fecha' : '12-12-2019', 'clave': '12345656787890309403940394034903490349304', 'tipodoc': 'retencion', 'pdf': 'pdf1', 'xml': 'xml1' },
  // {'fecha' : '12-12-2019', 'clave': '12345656787890309403940394034903490349304', 'tipodoc': 'retencion', 'pdf': 'pdf1', 'xml': 'xml1' },
  // {'fecha' : '12-12-2019', 'clave': '12345656787890309403940394034903490349304', 'tipodoc': 'retencion', 'pdf': 'pdf1', 'xml': 'xml1' },
  // {'fecha' : '12-12-2019', 'clave': '12345656787890309403940394034903490349304', 'tipodoc': 'retencion', 'pdf': 'pdf1', 'xml': 'xml1' },
  // {'fecha' : '12-12-2019', 'clave': '12345656787890309403940394034903490349304', 'tipodoc': 'retencion', 'pdf': 'pdf1', 'xml': 'xml1' },
  // {'fecha' : '12-12-2019', 'clave': '12345656787890309403940394034903490349304', 'tipodoc': 'retencion', 'pdf': 'pdf1', 'xml': 'xml1' },
  // {'fecha' : '12-12-2019', 'clave': '12345656787890309403940394034903490349304', 'tipodoc': 'retencion', 'pdf': 'pdf1', 'xml': 'xml1' },
  // {'fecha' : '12-12-2019', 'clave': '12345656787890309403940394034903490349304', 'tipodoc': 'retencion', 'pdf': 'pdf1', 'xml': 'xml1' },
  // {'fecha' : '12-12-2019', 'clave': '12345656787890309403940394034903490349304', 'tipodoc': 'retencion', 'pdf': 'pdf1', 'xml': 'xml1' },
  // {'fecha' : '12-12-2019', 'clave': '12345656787890309403940394034903490349304', 'tipodoc': 'retencion', 'pdf': 'pdf1', 'xml': 'xml1' },
  // {'fecha' : '12-12-2019', 'clave': '12345656787890309403940394034903490349304', 'tipodoc': 'retencion', 'pdf': 'pdf1', 'xml': 'xml1' }
]);
@ViewChild(MatPaginator) paginator: MatPaginator;
@ViewChild(MatSort) sort: MatSort;

// heroes$: Observable<Hero[]>;
displayedColumns: string[] = ['fecha', 'clave', 'tipodoc', 'pdf', 'xml'];
ruc;
  constructor(private route: ActivatedRoute, private srv: ApiService) { }

  ngOnInit() {
    this.ruc = this.route.snapshot.paramMap.get('ruc');
    const datos = {};
    datos['ruc'] = this.ruc;
    this.srv.reporte(datos).subscribe(data => {
      this.dataSource = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
