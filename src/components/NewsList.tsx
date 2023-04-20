import React, { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Grid } from "@mui/material";
import { INewsItem } from "../types/INewsItem";
import NewsItem from "./NewsItem";

interface NewsListProps {
  news: INewsItem[];
  onRefresh: (newNews: INewsItem[]) => void;
  loading: boolean;
}

const NewsList = ({ news, onRefresh, loading }: NewsListProps) => {
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [news]);

  const handleScroll = async () => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight ||
      loadingMore ||
      news.length >= 100
    ) {
      return;
    }
    setLoadingMore(true);
    const newNews = await fetchMoreNews(news.length, 20);
    onRefresh(newNews);
    setLoadingMore(false);
  };

  const fetchMoreNews = async (startIndex: number, count: number) => {
    const response = await fetch(
      `https://hacker-news.firebaseio.com/v0/newstories.json`
    );
    const allNewsIds = await response.json();
    const newsIdsToFetch = allNewsIds.slice(startIndex, startIndex + count);

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

  return (
    <>
      <Box position="sticky" top={16} m={2}>
        <Grid container justifyContent="center">
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={() => onRefresh([])}
            >
              Update news list
            </Button>
          </Grid>
        </Grid>
      </Box>
      {loading ? (
        <Grid container justifyContent="center" my={10}>
          <Grid item>
            <CircularProgress />
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={2}>
          {news.map((item) => (
            <Grid item xs={6} alignItems="stretch" key={item.id}>
              <NewsItem newsItem={item} />
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
};

export default NewsList;
