import React, { useEffect, useState } from 'react';
import NewsList from '../components/NewsList';
import { CssBaseline, Container } from '@mui/material';

const HomePage: React.FC = () => {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNews = async () => {
    setLoading(true);
    const response = await fetch('https://hacker-news.firebaseio.com/v0/newstories.json');
    const newsIds = await response.json();
    const topNewsIds = newsIds.slice(0, 100);
    
    const newsItems = await Promise.all(
      topNewsIds.map(async (id: number) => {
        const itemResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
        return itemResponse.json();
      })
    );
  
    setNews(newsItems);
    setLoading(false);
  };
  

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <CssBaseline />
      <Container>
        <NewsList news={news} onRefresh={fetchNews} loading={loading} />
      </Container>
    </>
  );  
};

export default HomePage;
