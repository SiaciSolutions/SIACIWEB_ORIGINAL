import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  elevacion = true;
  ruc = ''; // 1791949374001
  password = '';
  empresas;
  constructor(private router: Router, private srv: ApiService) { }

  ngOnInit() { 
    this.srv.empresas().subscribe(data => {
this.empresas = data;
    });
  }

  ingresar() {
    if (this.password.length === 0) {
      const datos = {};
      datos['ruc'] = this.ruc;
      this.router.navigate(['/lista', datos]);
    } else {
      const datos = {};
      datos['usuario'] = this.ruc;
      datos['password'] = this.password;
      this.srv.login(datos).subscribe(data => {
        if (data['codus1']) {
          this.router.navigate(['/panelusuario', datos]);
        }
      });
    }

  }
}
