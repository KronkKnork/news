import React, { useState } from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import parse from "html-react-parser";
import { IComment } from "../types/IComment";

interface CommentProps {
  comment: IComment;
  loadChildrenComments: (commentId: number) => Promise<IComment[]>;
}

const transformLink = (node: any) => {
  if (node.type === "tag" && node.name === "a") {
    return (
      <a
        href={node.attribs.href}
        style={{ color: "#8b75b1" }}
        target="_blank"
        rel="noopener noreferrer"
      >
        {parse(node.children[0].data)}
      </a>
    );
  }
};

const Comment = ({ comment, loadChildrenComments }: CommentProps) => {
  const [childrenComments, setChildrenComments] = useState<IComment[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!loaded) {
      setLoading(true);
      const comments = await loadChildrenComments(comment.id);
      setChildrenComments(comments);
      setLoaded(true);
      setLoading(false);
    } else {
      setLoaded(false);
    }
  };

  return (
    <Box
      sx={{
        my: 4,
        py: 1,
        pl: 4,
        pr: 1,
        borderLeft: "1px solid #9778ce",
        backgroundColor: "#252526",
        overflowX: "auto",
      }}
    >
      <Typography variant="caption">{comment.by}</Typography>
      <Box>
        <Typography component="div" variant="body1" color="text.secondary">
          {parse(String(comment.text), { replace: transformLink })}
        </Typography>
        {comment.kids && (
          <Button variant="outlined" color="primary" onClick={handleClick}>
            {loaded ? "Hidden comments" : "Show comments"}
            {loading && (
              <CircularProgress size={20} sx={{ marginLeft: "10px" }} />
            )}
          </Button>
        )}
      </Box>
      {loaded &&
        childrenComments.map((childComment) => (
          <Box key={childComment.id}>
            <Comment
              comment={childComment}
              loadChildrenComments={loadChildrenComments}
            />
          </Box>
        ))}
    </Box>
  );
};

export default Comment;
