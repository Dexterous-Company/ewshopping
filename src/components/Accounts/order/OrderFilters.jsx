import React from 'react';
import {
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Chip,
  Button,
  OutlinedInput,
  ListItemText
} from '@mui/material';

const OrderFilters = ({
  selectedStatuses,
  selectedTimes,
  orderStatuses,
  orderTimePeriods,
  onStatusChange,
  onTimePeriodChange,
  onClearFilters
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
      <FormControl size="small" fullWidth>
        <InputLabel>Order Status</InputLabel>
        <Select
          multiple
          value={selectedStatuses}
          onChange={onStatusChange}
          input={<OutlinedInput label="Order Status" />}
          renderValue={(selected) => selected.join(', ')}
        >
          {orderStatuses.map((status) => (
            <MenuItem key={status} value={status}>
              <Checkbox checked={selectedStatuses.includes(status)} />
              <ListItemText primary={status} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" fullWidth>
        <InputLabel>Time Period</InputLabel>
        <Select
          multiple
          value={selectedTimes}
          onChange={onTimePeriodChange}
          input={<OutlinedInput label="Time Period" />}
          renderValue={(selected) => selected.join(', ')}
        >
          {orderTimePeriods.map((time) => (
            <MenuItem key={time} value={time}>
              <Checkbox checked={selectedTimes.includes(time)} />
              <ListItemText primary={time} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <div className="md:col-span-2 flex justify-end">
        <Button
          onClick={onClearFilters}
          variant="outlined"
          size="small"
          disabled={!selectedStatuses.length && !selectedTimes.length}
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );
};

export default OrderFilters;