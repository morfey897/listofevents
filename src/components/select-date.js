import React, { useState, useCallback } from 'react';
import ListItem from '@material-ui/core/ListItem';

import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';


function SelectDate({from, to, onChange}) {

  const [fromDate, setFromDate] = useState(from || null);
  const [toDate, setToDate] = useState(to || null);

  const onFromChange = useCallback((d) => {
    setFromDate(d);
    if (typeof onChange === "function") {
      onChange({
        from: d,
        to: toDate
      });
    }
  }, [toDate]);

  const onToChange = useCallback((d) => {
    setToDate(d);
    if (typeof onChange === "function") {
      onChange({
        from: fromDate,
        to: d
      });
    }
  }, [fromDate]);


  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <ListItem dense>
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="MM.dd.yyyy"
            id="date-picker-from"
            label="Start date"
            value={fromDate}
            onChange={onFromChange}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
        </ListItem>

        <ListItem dense>
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="MM.dd.yyyy"
            id="date-picker-to"
            label="Final date"
            value={toDate}
            onChange={onToChange}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
        </ListItem>
    </MuiPickersUtilsProvider>);
}
export default SelectDate;