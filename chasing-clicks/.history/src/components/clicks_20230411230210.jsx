// Build a web page  with a clickable button and a click count. Every time that the button is clicked, the number increases by 1. When the web page is refreshed, the click count number should reflect all previous clicks. That means, refreshing the page should not reset the count to 0 or any other default number.

import React, { useEffect, useState } from 'react';

const Clicks = () => {
  const [count, setCount] = useState(0);
  const [previousClicks, setPriviousClicks] = useState([]);
  // Add a function so that When the web page is refreshed, the click count number should reflect all previous clicks
  // That means, refreshing the page should not reset the count to 0 or any other default number.
  // Hint: Use the useEffect hook to set the count to the last item in the previousClicks array
  // Hint: Use the useEffect hook to add the current count to the previousClicks array

  useEffect(() => {
    localStorage.setItem('previousClicks', JSON.stringify([...previousClicks, count]))

  return (
    <div>
      <h1>Clicks</h1>
      <button onClick={() => setCount(count + 1)}>Click Me</button>
      <p>Click Count: {count}</p>
      <p>Previous Clicks: {previousClicks.join(', ')}</p>
    </div>
  );
}

export default Clicks;