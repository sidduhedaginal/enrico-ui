import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  constructor(private router: Router) {}
  @Input() bgImg: string = '';
  @Input() title: string = '';
  @Input() icon: string = '';
  @Input() contentDescription: string = '';
  @Input() path: string = '';
  ngOnInit(): void {}

  navigateTo(path: string) {
    if(path=='Resource'){
      path='Resource-Management';
    }
    this.router.navigate([path]);
  }
}
