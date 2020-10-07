import React, { useCallback, useMemo } from "react";
import { addDays, startOfWeek } from 'date-fns';

function Calendar(C) {

  return ({categories, ...rest}) => {

    
  
    return <C {...rest} getColorIndex={getColorIndex} NOW={new Date()}/>;
  };
}

export default Calendar;