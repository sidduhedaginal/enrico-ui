import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'lib-dummy',
  templateUrl: './dummy.component.html',
  styleUrls: ['./dummy.component.css']
})
export class DummyComponent implements OnInit {

  constructor() { }

  up: boolean = false;
  right: boolean = false;
  down: boolean = false;
  left: boolean = false;


  // ngOnInit() {


  //   // Move up and center
  //   setTimeout(() => {
  //     this.up = true;
  //   }, 1000);

  //   // Move right and center
  //   setTimeout(() => {
  //     this.right = true;
  //     this.up = false;
  //   }, 2000);

  //   // Move down and center
  //   setTimeout(() => {
  //     this.down = true;
  //     this.right = false;
  //   }, 3000);

  //   // Move left and center
  //   setTimeout(() => {
  //     this.left = true;
  //     this.down = false;
  //   }, 4000);
  // }

  ngOnInit()
  {

    setInterval(() => {
      this.up = !this.up;
      this.right = !this.right;
      this.down = !this.down;
      this.left = !this.left;
    }, 500);

  }

  
  // ngOnInit() {

  //   setInterval(() => {
     
  //     // Move up and center
  //     setTimeout(() => {
  //       this.up = true;
  //     }, 1000);

  //     // Move right and center
  //     setTimeout(() => {
  //       this.right = true;
  //       this.up = false;
  //     }, 2000);

  //     // Move down and center
  //     setTimeout(() => {
  //       this.down = true;
  //       this.right = false;
  //     }, 3000);

  //     // Move left and center
  //     setTimeout(() => {
  //       this.left = true;
  //       this.down = false;
  //     }, 4000);


  //   }, 1);

  // }
  
}
