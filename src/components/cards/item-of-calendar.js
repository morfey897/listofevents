import React from 'react';
import { makeStyles, ButtonBase, Popover, Box, Typography } from "@material-ui/core";
import { format } from 'date-fns';
import { capitalCaseTransform as capitalCase } from 'change-case';


const useStyles = makeStyles((theme) => {
  return  {
    node: {
      display: "flex",
      justifyContent: "flex-start",
      width: "100%",
      overflow: "hidden",
      padding: theme.spacing("5px", "5px"),
      margin: theme.spacing("2px", "1px"),
      "&:last-child": {
        marginBottom: theme.spacing(0)
      }
    },
    time: {
      fontWeight: 700,
    },
    label: {
      marginLeft: "auto",
      paddingLeft: theme.spacing(1),
    },
    paper: {
      padding: theme.spacing(1),
    },
    popoverBox: {
      width: '200px'
    }
    // ...theme.getColors()
  };
});

function ItemOfCalendar({ date, label, colorClass}) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const openPopover = Boolean(anchorEl);

  return (
    <>
      <ButtonBase className={`${colorClass || ""} ${classes.node}`} onClick={handleClick}>
        <div className={classes.time}>
          {format(date, "HH:mm")}
        </div>
        <div className={classes.label}>
          {capitalCase(label)}
        </div>
      </ButtonBase>
      <Popover
        id={date}
        open={openPopover}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Box className={classes.popoverBox}>
          <Typography>Здесь будут отображатся подробности об этом событии</Typography>
        </Box>
      </Popover>
    </>
    
  );
}

export default ItemOfCalendar;
