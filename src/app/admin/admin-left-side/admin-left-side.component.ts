import { Component, OnInit } from '@angular/core';
import { ApiService } from './../../api.service';
import { Router } from '@angular/router'

@Component({
  selector: 'app-admin-left-side',
  templateUrl: './admin-left-side.component.html',
  styleUrls: ['./admin-left-side.component.css']
})
export class AdminLeftSideComponent implements OnInit {

  constructor(public auth: ApiService, private router: Router) { }

  ngOnInit() {
  }


	ocultar_menu_moviles(){

	   let body = document.getElementsByTagName('body')[0];
	body.classList.remove("sidebar-open"); 
	}






}
