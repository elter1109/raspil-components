import React from 'react';

export default function renderDate(date) {
 
  const dataObjectFromServer = new Date(date);
  const dataString = dataObjectFromServer.toLocaleDateString('RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  return (
    <span>
      {dataString}
    </span>
  );
}
 