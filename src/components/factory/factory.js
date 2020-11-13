import React from 'react';
import { INFO_BLOG, LATEST_BLOG, PERSON_CARD, EVENTS_CARD } from '../../enums/factory';

import InfoBlogChild from './info-blog';
import PersonCardChild from './person-card';
import LatestBlogChild from './latest-blog';
import EventsCardChild from './event-card';


export const Factory = ({type, props, onClickHandler}) => {

  switch(type) {
    case INFO_BLOG:
      return <InfoBlogChild {...props} />;
    case PERSON_CARD:
      return <PersonCardChild {...props} />;
    case LATEST_BLOG:
      return <LatestBlogChild {...props} />;
    case EVENTS_CARD:
      return <EventsCardChild {...props} />;
  }

  return <p></p>;
};