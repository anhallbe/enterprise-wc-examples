import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-modal-content',
  template: `
    <ids-dropdown label="Normal Dropdown" value="ca">
      <ids-list-box max-height="300px">
        <ids-list-box-option id="ca" value="ca">California</ids-list-box-option>
        <ids-list-box-option id="hi" value="hi">Hawaii</ids-list-box-option>
        <ids-list-box-option id="id" value="id">Idaho</ids-list-box-option>
        <ids-list-box-option id="il" value="il">Illinois</ids-list-box-option>
        <ids-list-box-option id="in" value="in">Indiana</ids-list-box-option>
        <ids-list-box-option id="ia" value="ia">Iowa</ids-list-box-option>
        <ids-list-box-option id="ks" value="ks">Kansas</ids-list-box-option>
        <ids-list-box-option id="ky" value="ky">Kentucky</ids-list-box-option>
        <ids-list-box-option id="la" value="la">Louisiana</ids-list-box-option>
        <ids-list-box-option id="me" value="me">Maine</ids-list-box-option>
        <ids-list-box-option id="md" value="md">Maryland</ids-list-box-option>
        <ids-list-box-option id="ma" value="ma">Massachusetts</ids-list-box-option>
        <ids-list-box-option id="mi" value="mi">Michigan</ids-list-box-option>
        <ids-list-box-option id="mn" value="mn">Minnesota</ids-list-box-option>
        <ids-list-box-option id="ms" value="ms">Mississippi</ids-list-box-option>
        <ids-list-box-option id="mo" value="mo">Missouri</ids-list-box-option>
        <ids-list-box-option id="mt" value="mt">Montana</ids-list-box-option>
        <ids-list-box-option id="ne" value="ne">Nebraska</ids-list-box-option>
        <ids-list-box-option id="nv" value="nv">Nevada</ids-list-box-option>
        <ids-list-box-option id="nh" value="nh">New Hampshire</ids-list-box-option>
        <ids-list-box-option id="nj" value="nj">New Jersey</ids-list-box-option>
        <ids-list-box-option id="nm" value="nm">New Mexico</ids-list-box-option>
        <ids-list-box-option id="ny" value="ny">New York</ids-list-box-option>
        <ids-list-box-option id="nc" value="nc">North Carolina</ids-list-box-option>
        <ids-list-box-option id="nd" value="nd">North Dakota</ids-list-box-option>
        <ids-list-box-option id="oh" value="oh">Ohio</ids-list-box-option>
        <ids-list-box-option id="ok" value="ok">Oklahoma</ids-list-box-option>
        <ids-list-box-option id="or" value="or">Oregon</ids-list-box-option>
        <ids-list-box-option id="pa" value="pa">Pennsylvania</ids-list-box-option>
        <ids-list-box-option id="ri" value="ri">Rhode Island</ids-list-box-option>
        <ids-list-box-option id="sc" value="sc">South Carolina</ids-list-box-option>
        <ids-list-box-option id="sd" value="sd">South Dakota</ids-list-box-option>
        <ids-list-box-option id="tn" value="tn">Tennessee</ids-list-box-option>
        <ids-list-box-option id="tx" value="tx">Texas</ids-list-box-option>
        <ids-list-box-option id="ut" value="ut">Utah</ids-list-box-option>
        <ids-list-box-option id="vt" value="vt">Vermont</ids-list-box-option>
        <ids-list-box-option id="va" value="va">Virginia</ids-list-box-option>
        <ids-list-box-option id="wa" value="wa">Washington</ids-list-box-option>
        <ids-list-box-option id="wv" value="wv">West Virginia</ids-list-box-option>
        <ids-list-box-option id="wi" value="wi">Wisconsin</ids-list-box-option>
        <ids-list-box-option id="wy" value="wy">Wyoming</ids-list-box-option>
      </ids-list-box>
    </ids-dropdown>

    <div class="modal-buttonset">
		<button type="button"
				  class="btn-modal"
				  (click)="cancel()">
        Cancel
        </button>
		<button type="button"
				  class="btn-modal-primary"
				  (click)="ok()">
        OK
        </button>
	</div>
  `,
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ModalContentComponent {
  cancel() {}
  ok() {}
}
