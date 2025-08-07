'use client'; // 声明这是一个客户端组件

import React, { useState, useEffect } from 'react';

// SWR 是一个更好的选择，但为了不引入新依赖，我们先用标准的 useEffect
// import useSWR from 'swr';

const BloombergNewsTestPage = () => {
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 这个函数会在组件加载到浏览器后执行
    const fetchData = async () => {
      const page = 1;
      const limit = 50;
      const bloombergApiUrl = `https://www.bloomberg.com/lineup-next/api/stories?limit=${limit}&pageNumber=${page}&types=ARTICLE,FEATURE,INTERACTIVE,LETTER,EXPLAINERS`;

      console.log(`[Frontend Fetch] Calling: ${bloombergApiUrl}`);

      try {
        const response = await fetch(bloombergApiUrl);

        if (!response.ok) {
          throw new Error(`Network response was not ok, status: ${response.status}`);
        }

        const data = await response.json();
        setStories(data);
      } catch (err) {
        console.error("Failed to fetch news:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // 空依赖数组意味着这个 effect 只运行一次

  if (isLoading) {
    return <div>Loading news from Bloomberg...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Bloomberg News (Fetched from Frontend)</h1>
      <p>This data is requested directly from your browser.</p>
      <hr />
      <ul>
        {stories.map(story => (
          <li key={story.id} style={{ margin: '10px 0' }}>
            <strong>{story.primarySyndication?.headline || 'No headline'}</strong>
            <p>{story.primarySyndication?.dek || ''}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BloombergNewsTestPage;