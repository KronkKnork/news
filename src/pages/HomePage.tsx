import React, { useState, useEffect } from "react";
import { Container } from "@mui/material";
import NewsList from "../components/NewsList";
import { INewsItem } from "../types/INewsItem";

const HomePage = () => {
  const [news, setNews] = useState<INewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const fetchedNews: INewsItem[] = await fetchInitialNews();
      setNews(fetchedNews);
      setLoading(false);
    };

    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchInitialNews = async () => {
    const response = await fetch(
      `https://hacker-news.firebaseio.com/v0/newstories.json`
    );
    const allNewsIds = await response.json();
    const newsIdsToFetch = allNewsIds.slice(0, 20);

    const fetchedNews = await Promise.all(
      newsIdsToFetch.map(async (id: number) => {
        const itemResponse = await fetch(
          `https://hacker-news.firebaseio.com/v0/item/${id}.json`
        );
        return itemResponse.json();
      })
    );

    return fetchedNews;
  };

  const handleRefresh = async (newNews: INewsItem[]) => {
    if (newNews.length === 0) {
      setLoading(true);
      const fetchedNews: INewsItem[] = await fetchInitialNews();
      setNews(fetchedNews);
      setLoading(false);
    } else {
      setNews((prevNews) => [...prevNews, ...newNews]);
    }
  };

  return (
    <Container>
      <NewsList news={news} onRefresh={handleRefresh} loading={loading} />
    </Container>
  );
};

export default HomePage;
