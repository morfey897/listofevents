import React, { useState, useCallback } from 'react';
import { ListItemText, ListItem, ListItemIcon, Checkbox, Collapse, Badge } from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';

function DropList({ list, showItems = Number.MAX_SAFE_INTEGER, generator, onToggle }) {

  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => {
    showItems < list.length && setOpen(!open);
  }, [open]);

  const contentGenerator = (start, end) => list.slice(start, end).map((data) => {
    const { _id, colorClass, checked } = data;
    const labelId = `list-label-${_id}`;
    return (
      <ListItem key={_id} dense button className={`${colorClass || ""}`} onClick={() => onToggle(_id)}>
        <ListItemIcon>
          <Checkbox
            color="default"
            edge="start"
            checked={checked}
            tabIndex={-1}
            disableRipple
            inputProps={{ 'aria-labelledby': labelId }}
          />
        </ListItemIcon>
        <ListItemText id={labelId} {...generator(data)} />
      </ListItem>
    );
  });

  return <>
    {contentGenerator(0, showItems)}
    {showItems < list.length && <>
      <ListItem button onClick={handleOpen} dense>
        <ListItemText primary={open ? `Hide` : `Show`} />
        {open ? <ExpandLess /> : <Badge color="primary" badgeContent={list.length - showItems}>
          <ExpandMore />
        </Badge>}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        {contentGenerator(showItems)}
      </Collapse>
    </>}
  </>;
}

export default DropList;