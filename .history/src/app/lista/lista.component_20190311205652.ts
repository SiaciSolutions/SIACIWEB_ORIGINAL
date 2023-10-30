import { Component, OnInit , ViewChild} from '@angular/core';
import { Params } from '@angular/router';
import {MatPaginator, MatTableDataSource, MatSort} from '@angular/material';

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


displayedColumns: string[] = ['fecha', 'clave', 'tipodoc', 'pdf', 'xml'];
  constructor(private navparmas : Params) { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
