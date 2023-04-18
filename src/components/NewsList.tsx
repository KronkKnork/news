import React from 'react';
import NewsItem from './NewsItem';
import { Box, Button, CircularProgress, Grid } from '@mui/material';

interface NewsListProps {
	news: any[];
	onRefresh: () => void;
	loading: boolean;
}

const NewsList: React.FC<NewsListProps> = ({ news, onRefresh, loading }) => {
	return (
		<>
			<Box position="sticky" top={16} m={2}>
				<Grid container justifyContent="center">
					<Grid item>
						<Button variant="contained" color="primary" onClick={onRefresh}>
							Обновить список новостей
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
