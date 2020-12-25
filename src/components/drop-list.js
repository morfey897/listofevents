import React, { useState, useCallback } from 'react';
import { ListItemText, ListItem, ListItemIcon, Checkbox, Collapse, Badge } from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';

function ContentItem({ children, onToggle, generator, ...data }) {
  const { _id, colorClass, checked } = data;
  const labelId = `list-label-${_id}`;
  return (
    <ListItem dense button className={`${colorClass || ""}`} onClick={() => onToggle(_id)}>
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
}

function DropList({ list, showItems = Number.MAX_SAFE_INTEGER, generator, onToggle }) {

  const { t } = useTranslation("general");
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => {
    setOpen((open) => !open);
  }, []);

  return <>
    {list.slice(0, showItems).map(data => <ContentItem key={data._id} {...data} generator={generator} onToggle={onToggle} />)}
    {showItems < list.length && <>
      <ListItem button onClick={handleOpen} dense>
        <ListItemText primary={open ? t("label_hide") : t("label_show")} />
        {open ? <ExpandLess /> : <Badge color="primary" badgeContent={list.length - showItems}>
          <ExpandMore />
        </Badge>}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        {list.slice(showItems).map(data => <ContentItem key={data._id} {...data} generator={generator} onToggle={onToggle} />)}
      </Collapse>
    </>}
  </>;
}

export default DropList;