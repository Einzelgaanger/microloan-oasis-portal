
import * as React from "react";
import { Input } from "./input";
import { Label } from "./label";

interface PhoneInputProps extends Omit<React.ComponentProps<"input">, "onChange"> {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export function PhoneInput({ value, onChange, label, ...props }: PhoneInputProps) {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let input = event.target.value.replace(/\D/g, '');
    
    // Format the phone number as the user types
    if (input.length > 0) {
      // For international format, add the plus at the beginning
      if (!input.startsWith('+')) {
        input = '+' + input;
      }
      
      // Format the rest of the number with spaces
      if (input.length > 3) {
        input = `${input.slice(0, 3)} ${input.slice(3)}`;
      }
      if (input.length > 7) {
        input = `${input.slice(0, 7)} ${input.slice(7)}`;
      }
      if (input.length > 12) {
        input = `${input.slice(0, 12)} ${input.slice(12)}`;
      }
    }
    
    onChange(input);
  };

  return (
    <div className="space-y-2">
      {label && <Label htmlFor={props.id}>{label}</Label>}
      <Input 
        type="tel" 
        value={value} 
        onChange={handleInputChange} 
        {...props} 
      />
    </div>
  );
}
