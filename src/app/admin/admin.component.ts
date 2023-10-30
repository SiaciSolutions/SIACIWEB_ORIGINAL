import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {

  bodyClasses = 'skin-blue sidebar-mini';
  body: HTMLBodyElement = document.getElementsByTagName('body')[0];

  constructor() { }

  ngOnInit() {
    // add the the body classes
    this.body.classList.add('skin-blue');
    this.body.classList.add('sidebar-mini');
  }

   ngOnDestroy() {
    // remove the the body classes
    this.body.classList.remove('skin-blue');
    this.body.classList.remove('sidebar-mini');
  }

}


//All skins in one file
// @import "skin-blue.less";
// @import "skin-blue-light.less";
// @import "skin-black.less";
// @import "skin-black-light.less";
// @import "skin-green.less";
// @import "skin-green-light.less";
// @import "skin-red.less";
// @import "skin-red-light.less";
// @import "skin-yellow.less";
// @import "skin-yellow-light.less";
// @import "skin-purple.less";
// @import "skin-purple-light.less";