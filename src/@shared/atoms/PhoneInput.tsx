import React, { forwardRef } from 'react';
import { IMaskInput } from 'react-imask';
import TextField from '@mui/material/TextField';
import { TextFieldProps } from '@mui/material';

interface PhoneMaskCustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const PhoneMaskCustom = forwardRef<HTMLInputElement, PhoneMaskCustomProps>(
  function PhoneMaskCustom(props, ref) {
    const { onChange, ...other } = props;
    return (
      <IMaskInput
        {...other}
        mask={[
          {
            mask: '(00) 0000-0000',
            lazy: true,
          },
          {
            mask: '(00) 0 0000-0000',
            lazy: true,
          },
        ]}
        inputRef={ref}
        onAccept={(value: any) => onChange({ target: { name: props.name, value } })}
      />
    );
  }
);

interface PhoneInputProps extends Omit<TextFieldProps, 'onChange'> {
  label: string;
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  required?: boolean;
  helperText?: React.ReactNode;
}

const PhoneInput: React.FC<PhoneInputProps> = ({ label, value, name, onChange, error, helperText, required, ...props }) => {
  return (
    <TextField
      {...props}
      label={label}
      value={value}
      name={name}
      onChange={onChange}
      error={error}
      helperText={helperText}
      variant="filled"
      required={required}
      InputProps={{
        inputComponent: PhoneMaskCustom as any,
      }}
    />
  );
};

export default PhoneInput;
