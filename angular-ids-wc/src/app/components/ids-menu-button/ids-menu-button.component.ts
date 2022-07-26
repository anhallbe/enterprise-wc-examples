import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { routes } from './ids-menu-button-routing.module';
import IdsDataGrid from 'ids-enterprise-wc/components/ids-data-grid/ids-data-grid';

@Component({
  selector: 'app-ids-menu-button',
  templateUrl: './ids-menu-button.component.html',
  styleUrls: ['./ids-menu-button.component.css']
})
export class IdsMenuButtonComponent implements AfterViewInit {
  @ViewChild('table', { read: ElementRef }) table: IdsDataGrid;
  public routes = routes.filter(r => r.path !== '');
  public columns = [];

  constructor(
    public router: Router
  ) { }

  ngAfterViewInit(): void {
    this.columns.push({
      id: 'name',
      name: 'Name',
      field: 'path',
      href: `${this.router.url}/{{value}}`,
      sortable: true,
      formatter: this.table.nativeElement.formatters.hyperlink
    });
    this.columns.push({
      id: 'type',
      name: 'Type',
      field: 'data',
      sortable: true,
      formatter: this.table.nativeElement.formatters.text
    });
    this.columns.push({
      id: 'description',
      name: 'Description',
      field: 'data',
      sortable: true,
      formatter: this.table.nativeElement.formatters.text
    });

    this.table.nativeElement.columns = this.columns;
    this.table.nativeElement.data = this.routes;
  }

}
