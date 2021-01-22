import DateFnsUtils from '@date-io/date-fns';
import {
  KeyboardDateTimePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';

function DateTimePicker({ label, value, onChange, placeholder, format, error }) {

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDateTimePicker
        required
        fullWidth
        disablePast
        ampm={false}
        label={label}
        margin="dense"

        value={value}

        onChange={onChange}
        placeholder={placeholder}

        format={format}
        animateYearScrolling={true}
        error={error}
      />
    </MuiPickersUtilsProvider>);
}
export default DateTimePicker;