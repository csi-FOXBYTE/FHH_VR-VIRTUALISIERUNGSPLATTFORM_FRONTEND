import React from 'react';
import { FormControl, InputLabel, MenuItem, Select, SelectProps } from '@mui/material';

type Option = {
    label: string;
    value: string;
};

type SelectCustomProps = Omit<SelectProps, 'onChange'> & {
    options: Option[];
    onChange: (value: string) => void;
    label: string;
};

const SelectCustom: React.FC<SelectCustomProps> = ({ options, onChange, label, value, ...props }) => {
    return (
        <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel>{label}</InputLabel>
            <Select
                label={label}
                value={value}
                onChange={(event) => onChange(event.target.value as string)}
                {...props}
            >
                {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default SelectCustom;