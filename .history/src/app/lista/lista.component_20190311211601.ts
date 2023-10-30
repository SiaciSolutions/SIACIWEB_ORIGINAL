import { Component, OnInit , ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {MatPaginator, MatTableDataSource, MatSort} from '@angular/material';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent implements OnInit {
dataSource = new MatTableDataSource([
  {'fecha' : '12-12-2018', 'clave': '12345656787890309403940394034903490349304', 'tipodoc': 'facctura', 'pdf': 'pdf', 'xml': 'xml' },
  {'fecha' : '12-12-2019', 'clave': '12345656787890309403940394034903490349304', 'tipodoc': 'retencion', 'pdf': 'pdf1', 'xml': 'xml1' },
  {'fecha' : '12-12-2019', 'clave': '12345656787890309403940394034903490349304', 'tipodoc': 'retencion', 'pdf': 'pdf1', 'xml': 'xml1' },
  {'fecha' : '12-12-2019', 'clave': '12345656787890309403940394034903490349304', 'tipodoc': 'retencion', 'pdf': 'pdf1', 'xml': 'xml1' },
  {'fecha' : '12-12-2019', 'clave': '12345656787890309403940394034903490349304', 'tipodoc': 'retencion', 'pdf': 'pdf1', 'xml': 'xml1' },
  {'fecha' : '12-12-2019', 'clave': '12345656787890309403940394034903490349304', 'tipodoc': 'retencion', 'pdf': 'pdf1', 'xml': 'xml1' },
  {'fecha' : '12-12-2019', 'clave': '12345656787890309403940394034903490349304', 'tipodoc': 'retencion', 'pdf': 'pdf1', 'xml': 'xml1' },
  {'fecha' : '12-12-2019', 'clave': '12345656787890309403940394034903490349304', 'tipodoc': 'retencion', 'pdf': 'pdf1', 'xml': 'xml1' },
  {'fecha' : '12-12-2019', 'clave': '12345656787890309403940394034903490349304', 'tipodoc': 'retencion', 'pdf': 'pdf1', 'xml': 'xml1' },
  {'fecha' : '12-12-2019', 'clave': '12345656787890309403940394034903490349304', 'tipodoc': 'retencion', 'pdf': 'pdf1', 'xml': 'xml1' },
  {'fecha' : '12-12-2019', 'clave': '12345656787890309403940394034903490349304', 'tipodoc': 'retencion', 'pdf': 'pdf1', 'xml': 'xml1' },
  {'fecha' : '12-12-2019', 'clave': '12345656787890309403940394034903490349304', 'tipodoc': 'retencion', 'pdf': 'pdf1', 'xml': 'xml1' },
  {'fecha' : '12-12-2019', 'clave': '12345656787890309403940394034903490349304', 'tipodoc': 'retencion', 'pdf': 'pdf1', 'xml': 'xml1' },
  {'fecha' : '12-12-2019', 'clave': '12345656787890309403940394034903490349304', 'tipodoc': 'retencion', 'pdf': 'pdf1', 'xml': 'xml1' }
]);
@ViewChild(MatPaginator) paginator: MatPaginator;
@ViewChild(MatSort) sort: MatSort;

// heroes$: Observable<Hero[]>;
displayedColumns: string[] = ['fecha', 'clave', 'tipodoc', 'pdf', 'xml'];
ruc;
  constructor(private route: ActivatedRoute, private srv: ApiService) { }

  ngOnInit() {
    const parametros = this.route.paramMap.pipe(
      switchMap(params => {
        // (+) before `params.get()` turns the string into a number
        this.ruc = params.get('ruc');
        return this.ruc;
        this.srv.reporte(params).subscribe(data => {
          console.log(data);
          if (data.length > 0) {
          }
        });
      })
    );


    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
