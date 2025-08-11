import React from 'react';
import { TextField, IconButton, Stack } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

interface CustomStepperProps {
  value: number;
  onChange: (value: number) => void;
}

export default function CustomStepper({ value, onChange }: CustomStepperProps) {
  const handleIncrement = () => onChange(value + 1);
  const handleDecrement = () => onChange(Math.max(0, value - 1));
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    if (!isNaN(newValue)) onChange(newValue);
  };

  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <TextField
        value={value}
        type="number"
        onChange={handleChange}
        sx={{ width: 80 }}
      />
      <Stack spacing={0}>
        <IconButton size="small" onClick={handleIncrement}>
          <KeyboardArrowUpIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={handleDecrement}>
          <KeyboardArrowDownIcon fontSize="small" />
        </IconButton>
      </Stack>
    </Stack>
  );
}
