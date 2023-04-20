import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Typography,
  Link as MuiLink,
  Grid,
  Link,
  CircularProgress,
} from "@mui/material";
import Comments from "../components/Comments";
import { Link as RouterLink } from "react-router-dom";
import { INewsItem } from "../types/INewsItem";
import { IComment } from "../types/IComment";

const NewsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [newsItem, setNewsItem] = useState<INewsItem>();
  const [comments, setComments] = useState<IComment[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNewsItem = async () => {
    const response = await fetch(
      `https://hacker-news.firebaseio.com/v0/item/${id}.json`
    );
    const newsItemData = await response.json();
    setNewsItem(newsItemData);
  };

  const fetchComments = async () => {
    if (newsItem && newsItem.kids) {
      setLoading(true);
      const commentsData = await Promise.all(
        newsItem.kids.map(async (commentId) => {
          const commentResponse = await fetch(
            `https://hacker-news.firebaseio.com/v0/item/${commentId}.json`
          );
          return commentResponse.json();
        })
      );
      setComments(commentsData);
      setLoading(false);
    }
  };

  const loadChildrenComments = async (commentId: number) => {
    const response = await fetch(
      `https://hacker-news.firebaseio.com/v0/item/${commentId}.json`
    );
    const commentData = await response.json();

    if (!commentData.kids) return [];

    const childrenComments = await Promise.all(
      commentData.kids.map(async (childCommentId: number) => {
        const childCommentResponse = await fetch(
          `https://hacker-news.firebaseio.com/v0/item/${childCommentId}.json`
        );
        return childCommentResponse.json();
      })
    );

    return childrenComments;
  };

  useEffect(() => {
    fetchNewsItem();
  }, [id]);

  useEffect(() => {
    fetchComments();
  }, [newsItem]);

  if (!newsItem) {
    return (
      <Container>
        <Grid container justifyContent="center" my={10}>
          <Grid item>
            <CircularProgress />
          </Grid>
        </Grid>
      </Container>
    );
  }

  return (
    <Container>
      <MuiLink
        component={RouterLink}
        to={`/`}
        underline="none"
        color="inherit"
        sx={{
          position: "fixed",
          left: "20px",
          top: "20px",
        }}
      >
        <Button variant="contained" color="primary">
          Back to news list
        </Button>
      </MuiLink>
      <Box mt={2} color="text.secondary">
        <Typography variant="h4" color="text.primary">
          {newsItem.title}
        </Typography>
        <Typography variant="body1">Author: {newsItem.by}</Typography>
        <Link href={newsItem.url} target="_blank" rel="noopener noreferrer">
          Go to source
        </Link>
      </Box>
      <Grid container justifyContent="space-between" alignItems="center" mt={2}>
        <Box>
          <Button variant="contained" color="primary" onClick={fetchComments}>
            Update comments
          </Button>
          {loading && (
            <CircularProgress size={20} sx={{ marginLeft: "10px" }} />
          )}
        </Box>
        <Typography variant="body1" align="right">
          Comments: {newsItem.descendants}
        </Typography>
      </Grid>
      <Box mt={2}>
        {comments.map((comment) => (
          <Comments
            key={comment.id}
            comment={comment}
            loadChildrenComments={loadChildrenComments}
          />
        ))}
      </Box>
    </Container>
  );
};

export default NewsPage;
