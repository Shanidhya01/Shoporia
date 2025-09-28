import React, { useEffect } from 'react'

function PageTitle({ title }) {
  useEffect(() => {
    document.title = `Shoporia - ${title}`;
  }, [title]);
  return null;
}

export default PageTitle
