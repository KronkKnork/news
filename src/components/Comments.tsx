import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import parse from 'html-react-parser';

interface CommentProps {
	comment: any;
	loadChildrenComments: (commentId: number) => Promise<any[]>;
}

const transformLink = (node: any) => {
	if (node.type === 'tag' && node.name === 'a') {
		return <a href={node.attribs.href} style={{ color: '#8b75b1' }} target="_blank" rel="noopener noreferrer">{parse(node.children[0].data)}</a>;
	}
};

const Comment: React.FC<CommentProps> = ({ comment, loadChildrenComments }) => {
	const [childrenComments, setChildrenComments] = useState<any[]>([]);
	const [loaded, setLoaded] = useState(false);

	const handleClick = async () => {
		if (!loaded) {
			const comments = await loadChildrenComments(comment.id);
			setChildrenComments(comments);
			setLoaded(true);
		} else {
			setLoaded(false);
		}
	};

	return (
		<Box sx={{ my: 4, px: 4, py: 3, borderLeft: '1px solid #9778ce', backgroundColor: '#252526' }}>
			<Typography variant="caption" color="text.secondary">Автор: {comment.by}</Typography>
			<Box>
				<Typography component="div" variant="body1" color="text.secondary" >{parse(comment.text, { replace: transformLink })}</Typography>
				{comment.kids && (
					<Button variant="text" color="primary" onClick={handleClick}>
						{loaded ? 'Скрыть комментарии' : 'Показать комментарии'}
					</Button>
				)}
			</Box>
			{loaded &&
				childrenComments.map((childComment) => (
					<Box key={childComment.id} ml={3}>
						<Comment comment={childComment} loadChildrenComments={loadChildrenComments} />
					</Box>
				))}
		</Box>
	);
};

export default Comment;
