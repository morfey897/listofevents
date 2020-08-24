import React, { useState } from 'react';
import ListItem from '@material-ui/core/ListItem';

import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';


function SelectDate() {

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      {/* <List> */}
        <ListItem>
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="MM.dd.yyyy"
            id="date-picker-from"
            label="Start date"
            value={fromDate}
            onChange={setFromDate}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
        </ListItem>

        <ListItem>
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="MM.dd.yyyy"
            id="date-picker-to"
            label="Final date"
            value={toDate}
            onChange={setToDate}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
        </ListItem>
      {/* </List> */}
    </MuiPickersUtilsProvider>);
}
export default SelectDate;