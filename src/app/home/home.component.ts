import { Component } from '@angular/core';
import { cardType } from '../model/card';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  currentPath: string = '';
  constructor(private router: Router) {}

  ngOnInit() {
    this.currentPath = this.router.url;
  }

  homeCards: cardType[] = [
    {
      backgroundImg: 'srn-bg.svg',
      title: 'Master Data',
      icon: 'srn.svg',
      contentDescription: 'Master Data for Outsourcing.',
      path: 'dashboard',
    },
    {
      backgroundImg: 'planning-bg.svg',
      title: 'Planning',
      icon: 'planning.svg',
      contentDescription: 'Annual Outsourcing Planning.',
      path: 'planning',
    },
    {
      backgroundImg: 'sowjd-bg.svg',
      title: 'SoW JD',
      icon: 'sowjd.svg',
      contentDescription: 'SoW JD',
      path: 'sowjd/my-sowjd',
    },
  {
    backgroundImg: 'sowjd-bg.svg',
    title: 'SoW JD SRN',
    icon: 'sowjd.svg',
    contentDescription: 'SoW JD SRN',
    path: 'sowjd-srn',
  },
    {
      backgroundImg: 'resource-bg.svg',
      title: 'Resource',
      icon: 'resource.svg',
      contentDescription: 'Resource Management',
      path: 'Resource-Management',
    },
    {
      backgroundImg: 'resource-bg.svg',
      title: 'My Actions',
      icon: 'reference.svg',
      contentDescription: 'My Actions',
      path: 'my-actions',
    },
  ];
}
