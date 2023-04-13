// Build a web page  with a clickable button and a click count. Every time that the button is clicked, the number increases by 1. When the web page is refreshed, the click count number should reflect all previous clicks. That means, refreshing the page should not reset the count to 0 or any other default number.

import React, { useEffect, useState } from 'react';

const Clicks = () => {
  const [count, setCount] = useState(0);
  const [previousClicks, setPreviousClicks] = useState([]);
  // Add a function so that When the web page is refreshed, the click count number should reflect all previous clicks
  // That means, refreshing the page should not reset the count to 0 or any other default number.

  useEffect(() => {
    localStorage.setItem('previousClicks', JSON.stringify([...previousClicks, count]))
  }, [previousClicks, count])

  useEffect(() => {
    const previousClicks = JSON.parse(localStorage.getItem('previousClicks'))
    if (previousClicks) {
      setPreviousClicks(previousClicks)
      setCount(previousClicks[previousClicks.length - 1])
    }
  }, [])

  return (
    <div>
      <h1>Clicks</h1>
      <button onClick={() => setCount(count + 1)}>Click Me</button>
      <p>Click Count: {count}</p>
      <p>Previous Clicks: {previousClicks.join(', ')}</p>
    </div>
  );
};

export default Clicks;