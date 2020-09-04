import React, { useMemo, useEffect } from "react";

import TimeCalendar from "./time-calendar";
import { addDays } from "date-fns";

function DailyCalendar({ date, ...rest }) {
  
  const dates = useMemo(() => [-1,0,1].map((day) => addDays(date, day)), [date]);

  return <TimeCalendar {...rest} dates={dates} />;
}

export default DailyCalendar;