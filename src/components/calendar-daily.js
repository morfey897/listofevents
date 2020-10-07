import React, { useMemo } from "react";

import TimeCalendar from "./calendar-time";
import { addDays } from "date-fns";

function CalendarDaily({ date, ...rest }) {
  
  const dates = useMemo(() => [-1,0,1].map((day) => addDays(date, day)), [date]);

  return <TimeCalendar {...rest} dates={dates} />;
}

export default CalendarDaily;