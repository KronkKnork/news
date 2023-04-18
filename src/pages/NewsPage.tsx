import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, Container, Typography, Link as MuiLink } from '@mui/material';
import Comments from '../components/Comments';
import { Link as RouterLink } from 'react-router-dom';

const NewsPage: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const [newsItem, setNewsItem] = useState<any>(null);
	const [comments, setComments] = useState<any[]>([]);

	const fetchNewsItem = async () => {
		const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
		const newsItemData = await response.json();
		setNewsItem(newsItemData);
	};

	const fetchComments = async () => {
		if (newsItem && newsItem.kids) {
			const commentsData = await Promise.all(
				newsItem.kids.map(async (commentId: number) => {
					const commentResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${commentId}.json`);
					return commentResponse.json();
				})
			);
			setComments(commentsData);
		}
	};

	const loadChildrenComments = async (commentId: number) => {
		const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${commentId}.json`);
		const commentData = await response.json();

		if (!commentData.kids) return [];

		const childrenComments = await Promise.all(
			commentData.kids.map(async (childCommentId: number) => {
				const childCommentResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${childCommentId}.json`);
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
		return <div>Loading...</div>;
	}

	return (
		<Container>
			<MuiLink component={RouterLink} to={`/`} underline="none" color="inherit">
				<Button variant="contained" color="primary">
					Вернуться к списку новостей
				</Button>
			</MuiLink>
			<Box mt={2}>
				<Typography variant="h4">{newsItem.title}</Typography>
				<Typography variant="body1">Автор: {newsItem.by}</Typography>
				<Typography variant="body1">
					Дата публикации: {new Date(newsItem.time * 1000).toLocaleString()}
				</Typography>
				<Typography variant="body1">Комментарии: {newsItem.descendants}</Typography>
				<a href={newsItem.url} target="_blank" rel="noopener noreferrer">
					Перейти к источнику
				</a>
			</Box>
			<Box mt={2}>
				<Button variant="contained" color="primary" onClick={fetchComments}>
					Обновить комментарии
				</Button>
			</Box>
			<Box mt={2}>
				{comments.map((comment) => (
					<Comments key={comment.id} comment={comment} loadChildrenComments={loadChildrenComments} />
				))}
			</Box>
		</Container>
	);
};

export default NewsPage;
