import React, { useRef, useState } from 'react';
import useEvent from '../../hooks/useEvent';
import IdsGrid, { IdsGridCell } from '../../components/ids-grid/IdsGrid';
import IdsTitle from '../../components/ids-title/IdsTitle';
import type IdsInputType from 'ids-enterprise-wc/components/ids-input/ids-input';
import 'ids-enterprise-wc/components/ids-input/ids-input';


const IdsInput = () => {
  const sourceInputRef = useRef<IdsInputType>();
  const destinationInputRef = useRef<IdsInputType>();
  const [value, setValue] = useState('');

  // Event handler to be used in attach and cleanup event listener
  const handleChange = (e: any) => {
    const destinationInput = destinationInputRef.current;
    if (destinationInput) destinationInput.value = e?.target?.value;
    setValue(e?.target?.value);
  };

  useEvent('keyup', handleChange, sourceInputRef);

  return (
    <>
      <IdsTitle>Ids Input Example</IdsTitle>

      <IdsGrid cols="3" gap="md">
        <IdsGridCell>
          <ids-text font-size="12" type="h1">
            Ids Input
          </ids-text>
        </IdsGridCell>
        <IdsGridCell>
          <ids-text font-size="12" type="h2">
            Ids Input - Sizes
          </ids-text>
        </IdsGridCell>
        <IdsGridCell>
          <ids-text font-size="12" type="h2">
            Input - Enable/ Disable/ Readonly
          </ids-text>
        </IdsGridCell>
      </IdsGrid>

      <IdsGrid cols="3" gap="md">
        <IdsGridCell>
          <ids-input
            ref={sourceInputRef}
            type="text"
            label="To change value of below readonly fields"
          ></ids-input>
          <ids-input
            type="text"
            label="Changing value with state"
            validate="required"
            value={value}
          ></ids-input>
          <ids-input
            ref={destinationInputRef}
            type="text"
            label="Changing value with events"
            readonly="true"
          ></ids-input>
          <ids-input
            type="text"
            label="First Name"
            placeholder="Normal text Field"
          ></ids-input>
          <ids-input
            type="text"
            label="Last Name"
            validate="required"
          ></ids-input>
          <ids-input
            type="text"
            label="Email Address"
            placeholder="Company@address.com"
            validate="email required"
          ></ids-input>
          <ids-input
            type="text"
            label="Disabled"
            disabled="true"
            value="Field not editable"
          ></ids-input>
          <ids-input
            type="text"
            label="Readonly"
            readonly="true"
            value="02006"
          ></ids-input>
          <ids-input
            type="text"
            label="Dirty Tracking"
            dirty-tracker="true"
            placeholder="Dirty Tracking"
            value="02006"
          ></ids-input>
          <ids-input
            type="text"
            label="Clearable"
            placeholder="Clearable text Field"
            clearable="true"
          ></ids-input>
          <ids-input
            type="text"
            label="Autoselect"
            value="Text select on focus"
            autoselect="true"
          ></ids-input>
        </IdsGridCell>

        <IdsGridCell>
          <ids-input size="xs" label="Xtra Small"></ids-input>
          <ids-input size="sm" label="Small"></ids-input>
          <ids-input size="mm" label="Small - Medium"></ids-input>
          <ids-input size="md" label="Medium"></ids-input>
        </IdsGridCell>

        <IdsGridCell>
          <ids-input
            id="input-toggle-state"
            label="Text Field"
            value="Some text"
          ></ids-input>

          <ids-button id="btn-input-enable" appearance="secondary">
            <span>Enable</span>
          </ids-button>
          <ids-button id="btn-input-disable" appearance="secondary">
            <span>Disable</span>
          </ids-button>
          <ids-button id="btn-input-readonly" appearance="secondary">
            <span>Readonly</span>
          </ids-button>
        </IdsGridCell>
      </IdsGrid>

      <IdsGrid auto-fit>
        <IdsGridCell>
          <ids-text font-size="12" type="h2">
            Ids Input - Text align
          </ids-text>
        </IdsGridCell>
      </IdsGrid>
      <IdsGrid cols="3" gap="md">
        <IdsGridCell>
          <ids-input
            label="Default align (left)"
            value="Default align"
          ></ids-input>
          <ids-input
            label="Left align"
            value="Left align"
            text-align="left"
          ></ids-input>
          <ids-input
            label="Center align"
            value="Center align"
            text-align="center"
          ></ids-input>
          <ids-input
            label="Right align"
            value="Right align"
            text-align="right"
          ></ids-input>
        </IdsGridCell>
      </IdsGrid>
    </>
  );
};

export default IdsInput;
