import React, { useMemo } from "react";
import { addDays, startOfWeek } from 'date-fns';

import TimeCalendar from "./time-calendar";

function WeeklyCalendar({ date, ...rest }) {

  const dates = useMemo(() => {
    const startWeek = startOfWeek(date, {weekStartsOn: 1});
    return [0,1,2,3,4,5,6].map((day) => addDays(startWeek, day));
  }, [date]);

  return <TimeCalendar {...rest} dates={dates} />;
}

export default WeeklyCalendar;