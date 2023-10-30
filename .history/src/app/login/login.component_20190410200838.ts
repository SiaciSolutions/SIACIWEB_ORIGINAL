import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  elevacion = true;
  ruc = ''; // 1791949374001
  password = '';
  constructor(private router: Router, ) { }

  ngOnInit() { }

  ingresar() {
    if (this.password.length === 0) {
      const datos = {};
      datos['ruc'] = this.ruc;
      this.router.navigate(['/lista', datos]);
    } else {
      const datos = {};
      datos['ruc'] = this.ruc;
      this.router.navigate(['/lista', datos]);
    }

  }
}
