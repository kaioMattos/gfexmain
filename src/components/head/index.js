import React, { useEffect } from 'react';

const Head = ({ title, description }) => {
  useEffect(() => {
    document.title = title;
    document
      .querySelector("meta[name='description']")
      .setAttribute('content', description);
  }, [title, description]);

  return <></>;
};

export default Head;