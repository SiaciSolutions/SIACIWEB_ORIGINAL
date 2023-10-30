import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  elevacion = true;
  ruc = '1792358507001';
  constructor(private router: Router, ) {}

  ngOnInit() {}

  ingresar() {
    const datos = {};
    datos['ruc'] = this.ruc;
    this.router.navigate(['/lista', datos]);

  }
}
