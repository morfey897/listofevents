import React, { useState, useCallback } from 'react';
import { ListItemText, ListItem, ListItemIcon, Checkbox, Collapse, Badge, withTheme } from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import { FUTURE } from '../static/tense';

function DropList({ list, showItems = Number.MAX_SAFE_INTEGER, generator, theme, onChange, getColorIndex }) {

  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(list.filter(({ checked }) => checked).map(({ _id }) => _id));

  const handleOpen = useCallback(() => {
    showItems < list.length && setOpen(!open);
  }, [open]);

  const handleToggle = useCallback((id) => {
    let newChecked;
    if (checked.indexOf(id) === -1) {
      newChecked = checked.concat(id);
    } else {
      newChecked = checked.filter((a => a !== id));
    }
    setChecked(newChecked);
    if (typeof onChange === "function") {
      onChange(list.map((data) => ({
        ...data,
        checked: newChecked.indexOf(data._id) !== -1
      })));
    }
  }, [checked]);

  const contentGenerator = (start, end) => list.slice(start, end).map((data) => {
    const { _id, colorClass } = data;
    const labelId = `list-label-${_id}`;
    return (
      <ListItem key={_id} dense button className={`${colorClass || ""}`} onClick={() => handleToggle(_id)}>
        <ListItemIcon>
          <Checkbox
            color="default"
            edge="start"
            checked={checked.indexOf(_id) !== -1}
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