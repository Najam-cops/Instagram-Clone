import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Typography,
  Avatar,
  IconButton,
} from "@mui/material";
import Carousel from "react-material-ui-carousel";
import { Post } from "../types/post";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import ShareIcon from "@mui/icons-material/Share";

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post._count.Likes);

  const handleLikeClick = () => {
    setLiked(!liked);
    setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
    console.log("Like clicked");
  };

  const handleCommentClick = () => {
    console.log("Comment clicked");
  };

  return (
    <Card className="max-w-[470px] mb-6 mx-auto border border-gray-200 rounded-lg shadow-none">
      <CardHeader
        className="px-4 py-3"
        avatar={
          <Avatar src={post.user.profileImage || undefined} className="w-8 h-8">
            {post.user.username[0].toUpperCase()}
          </Avatar>
        }
        title={
          <span className="text-sm font-semibold">{post.user.username}</span>
        }
      />
      {post.images.length > 0 && (
        <CardMedia className="relative">
          <Carousel
            autoPlay={false}
            animation="slide"
            indicators={post.images.length > 1}
            navButtonsAlwaysInvisible={post.images.length === 1}
            className="aspect-square"
          >
            {post.images.map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt={post.description || `Post image ${index + 1}`}
                className="w-full h-[470px] object-cover"
              />
            ))}
          </Carousel>
        </CardMedia>
      )}
      <div className="px-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <IconButton onClick={handleLikeClick} className="p-2">
              {liked ? (
                <FavoriteIcon className="text-red-500" />
              ) : (
                <FavoriteBorderIcon />
              )}
            </IconButton>
            <IconButton onClick={handleCommentClick} className="p-2">
              <ChatBubbleOutlineIcon />
            </IconButton>
            <IconButton className="p-2">
              <ShareIcon />
            </IconButton>
          </div>
          <IconButton className="p-2">
            <BookmarkBorderIcon />
          </IconButton>
        </div>
      </div>
      <CardContent className="px-4 pt-1 pb-3">
        <Typography className="text-sm font-semibold mb-1">
          {likesCount} likes
        </Typography>
        {post.description && (
          <Typography className="text-sm">
            <span className="font-semibold mr-2">{post.user.username}</span>
            {post.description}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default PostCard;
