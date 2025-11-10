import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../Card/card";
import ReactionBar from "../Reactions/reactions";
import CommentBox from "../commentBox/commentBox";
import { DEFAULT_AVATAR_IMAGE } from "../../constants/userAssets";
import { apiRequest } from "../../utils/api";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?q=80&w=2070&auto=format&fit=crop";

export default function PostItem({ post, onPostUpdated }) {
  const [postData, setPostData] = useState(post);

  // Update state when post prop changes
  useEffect(() => {
    setPostData(post);
  }, [post]);

  // Use post data from state
  const avatar = postData?.author?.avatarUrl || DEFAULT_AVATAR_IMAGE;
  const name = postData?.author?.name || "Dummy User";
  const title = postData?.author?.title || "SDE-II Engineer @Amazon";
  const text = postData?.text || "Lorem ipsum dolor sit amet consectetur adipisicing...";
  const imageUrl = postData?.imageUrl || FALLBACK_IMAGE;

  const [likesCount, setLikesCount] = useState(postData?.likesCount || 0);
  const [selectedReaction, setSelectedReaction] = useState(postData?.liked ? "like" : null);
  const [comments, setComments] = useState([]);
  const [commentsCount, setCommentsCount] = useState(postData?.commentsCount || 0);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  // Update state when post prop changes
  useEffect(() => {
    setPostData(post);
    setLikesCount(post?.likesCount || 0);
    setSelectedReaction(post?.liked ? "like" : null);
    setCommentsCount(post?.commentsCount || 0);
  }, [post]);

  useEffect(() => {
    let isMounted = true;
    async function fetchComments() {
      setLoadingComments(true);
      try {
        const data = await apiRequest(`/posts/${postData.id}/comments`);
        if (isMounted) {
          setComments(data);
          setCommentsCount(data.length);
        }
      } catch (err) {
        console.error("Failed to load comments", err);
      } finally {
        if (isMounted) setLoadingComments(false);
      }
    }
    fetchComments();
    return () => {
      isMounted = false;
    };
  }, [postData.id]);

  async function handleReaction(next) {
    try {
      if (next) {
        const updated = await apiRequest(`/posts/${postData.id}/like`, { method: "POST" });
        setLikesCount(updated.likesCount ?? likesCount + 1);
        setSelectedReaction(next);
        onPostUpdated?.(updated);
        // Update local post data with new like info
        setPostData(prev => ({...prev, ...updated}));
      } else {
        const updated = await apiRequest(`/posts/${postData.id}/unlike`, { method: "POST" });
        setLikesCount(updated.likesCount ?? Math.max(0, likesCount - 1));
        setSelectedReaction(null);
        onPostUpdated?.(updated);
        // Update local post data with new like info
        setPostData(prev => ({...prev, ...updated}));
      }
    } catch (err) {
      console.error("Failed to update reaction", err);
    }
  }

  async function handleAddComment(text) {
    try {
      setCommentSubmitting(true);
      const res = await apiRequest(`/posts/${postData.id}/comments`, {
        method: "POST",
        body: { text },
      });
      if (res?.comment) {
        setComments((prev) => {
          const next = [...prev, res.comment];
          setCommentsCount(res.commentsCount ?? next.length);
          return next;
        });
      } else {
        setComments((prev) => [
          ...prev,
          {
            id: `temp-${Date.now()}`,
            text,
            user: { name: "You", avatarUrl: avatar },
          },
        ]);
        setCommentsCount((c) => c + 1);
      }
    } catch (err) {
      console.error("Failed to add comment", err);
    } finally {
      setCommentSubmitting(false);
    }
  }

  return (
    <Card>
      <div className="flex gap-3 items-start">
        <Link to="/profile" className="shrink-0">
          <img src={avatar} alt="avatar" className="w-10 h-10 rounded-full" />
        </Link>
        <div className="min-w-0 flex-1">
          <Link to="/profile" className="font-semibold hover:underline">
            {name}
          </Link>
          <div className="text-xs text-gray-600">{title}</div>
          <div className="mt-3 text-[15px] whitespace-pre-line">{text}</div>
        </div>
      </div>

      {imageUrl && (
        <div className="mt-3">
          <img
            src={imageUrl}
            className="w-full max-h-[360px] object-cover rounded-md"
            alt="post"
          />
        </div>
      )}

      <div className="mt-3 flex items-center justify-between text-xs text-gray-600">
        <div>{likesCount} Likes</div>
        <div>{commentsCount} Comments</div>
      </div>

      <div className="mt-2 border-t border-gray-200 pt-3">
        <ReactionBar
          selected={selectedReaction}
          count={likesCount}
          onChange={handleReaction}
        />
      </div>

      <div className="mt-3">
        <CommentBox
          submitting={commentSubmitting}
          onSubmit={handleAddComment}
        />
        {loadingComments && <div className="text-xs text-gray-500 mt-2">Loading comments...</div>}
        {comments.length > 0 && (
          <div className="mt-3 space-y-2">
            {comments.map((c) => (
              <div key={c.id} className="flex gap-2 items-start">
                <img
                  src={c.user?.avatarUrl || DEFAULT_AVATAR_IMAGE}
                  className="w-7 h-7 rounded-full"
                  alt={c.user?.name || "User"}
                />
                <div className="bg-gray-100 px-3 py-2 rounded-2xl">
                  <div className="text-sm font-semibold">{c.user?.name || "User"}</div>
                  <div className="text-sm">{c.text}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}