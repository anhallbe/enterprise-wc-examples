import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { SohoComponentsModule, SohoModalDialogService } from 'ids-enterprise-ng';
import { ModalContentComponent } from './modal-content.component';

@Component({
  selector: 'app-modal',
  template: `
  <link rel="stylesheet"
			id="stylesheet"
			href="/assets/ids-enterprise/css/theme-new-light.min.css"
			type="text/css">

  <ids-container padding="8" hidden class="page-container">
    <ids-theme-switcher mode="light"></ids-theme-switcher>

    <ids-layout-grid auto-fit="true" padding="md">
      <ids-text font-size="12" type="h1">Dropdown in Modal</ids-text>
    </ids-layout-grid>

    <ids-layout-grid gap="sm" margin="md">
      <ids-layout-grid-cell>
        <ids-text>
          When a dropdown is inside a Soho modal (SohoModalDialogService), it is not displayed correctly. When the dropdown is opened the user has to scroll down to see the content.
        </ids-text>
        <ids-button (click)="openModal()">Open Modal</ids-button>
      </ids-layout-grid-cell>
    </ids-layout-grid>
  </ids-container>
  `,
  standalone: true,
  imports: [SohoComponentsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ModalComponent {
  private dialogService = inject(SohoModalDialogService);

  openModal() {
    this.dialogService.modal(ModalContentComponent).title("Dropdown in Soho modal").open();
  }

}
