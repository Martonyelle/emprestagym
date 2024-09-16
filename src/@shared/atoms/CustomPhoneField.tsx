import React from 'react';
import { FieldProps } from 'firecms';
import PhoneInput from './PhoneInput';


const CustomPhoneField: React.FC<FieldProps<string>> = ({
  value,
  setValue,
  error,
  property,
}) => {
  return (
    <PhoneInput
      label={property.name || ''}
      value={value || ''}
      name={property.name || ''}
      onChange={(event: any) => setValue(event.target.value)}
      error={!!error}
      helperText={error}
      fullWidth
      required={property.validation?.required}
    />
  );
};

export default CustomPhoneField;
