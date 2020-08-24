import React, { useState } from 'react';
import { ListItemText, ListItem, ListItemIcon, Checkbox, Collapse } from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';

function DropList({ uniqId, list, isOpen, header, generator }) {

  const [open, setOpen] = useState(!!isOpen);
  const [checked, setChecked] = useState([]);

  const handleToggle = (id) => () => {
    if (checked.indexOf(id) === -1) {
      setChecked(checked.concat(id));
    } else {
      setChecked(checked.filter((a => a !== id)));
    }
  };

  return <>
      <ListItem button onClick={() => setOpen(!open)}>
        {header}
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        {list.map((data) => {
          const { _id } = data;
          const labelId = `${uniqId}-list-label-${_id}`;
          return (
            <ListItem key={_id} dense button onClick={handleToggle(_id)}>
              <ListItemIcon>
                <Checkbox
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
        })}
      </Collapse>
    </>;
}

export default DropList;