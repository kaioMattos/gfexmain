import React, { useEffect } from 'react';

const MetaUrl = ({ title, description }) => {
  useEffect(() => {
    document.title = title;
    document
      .querySelector("meta[name='description']")
      .setAttribute('content', description);
  }, [title, description]);

  return <></>;
};

export default MetaUrl;