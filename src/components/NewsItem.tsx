import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { Link as MuiLink } from "@mui/material";
import { styled } from "@mui/system";
import { INewsItem } from "../types/INewsItem";

interface NewsItemProps {
  newsItem: INewsItem;
}

const StyledBox = styled(Box)(({ theme }) => ({
  "&:hover": {
    borderColor: theme.palette.text.primary,
  },
}));

const NewsItem = ({ newsItem }: NewsItemProps) => {
  return (
    <MuiLink
      component={RouterLink}
      to={`/news/${newsItem.id}`}
      underline="none"
      color="inherit"
    >
      <StyledBox
        p={2}
        mt={1}
        border=".1px solid"
        borderColor="ActiveBorder"
        borderRadius={2}
      >
        <Typography variant="body2" color="text.secondary">
          {new Date(newsItem.time * 1000).toLocaleString()}
        </Typography>
        <Grid container justifyContent="space-between">
          <Grid item xs={8}>
            <Typography variant="h6" color="text.primary">
              {newsItem.title}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography variant="body1" align="right" color="text.secondary">
              Rating: {newsItem.score}
            </Typography>
          </Grid>
        </Grid>
        <Grid container justifyContent="space-between" mt={3}>
          <Grid item xs={6}>
            <Typography variant="body1" color="text.secondary">
              {newsItem.by}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1" align="right" color="text.secondary">
              Comments: {newsItem.descendants}
            </Typography>
          </Grid>
        </Grid>
      </StyledBox>
    </MuiLink>
  );
};

export default NewsItem;
