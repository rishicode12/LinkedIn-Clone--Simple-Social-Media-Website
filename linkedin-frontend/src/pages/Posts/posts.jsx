import React, { useContext, useEffect, useState } from "react";
import Card from "../../components/Card/card";
import ProfileCard from "../../components/ProfileCard/profileCard";
import VideoCameraBackIcon from '@mui/icons-material/VideoCameraBack';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import ArticleIcon from '@mui/icons-material/Article';
import Advertisement from "../../components/Advertisement/advertisement";
import { Link } from "react-router-dom";
import { DEFAULT_AVATAR_IMAGE, BLANK_AVATAR_IMAGE } from "../../constants/userAssets";
import PostItem from "../../components/PostItem/postItem";
import { apiRequest } from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";

const Posts = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [error, setError] = useState("");
  const [composerOpen, setComposerOpen] = useState(false);
  const [composerText, setComposerText] = useState("");
  const [composerImageFile, setComposerImageFile] = useState(null);
  const [composerImagePreview, setComposerImagePreview] = useState("");
  const [submittingPost, setSubmittingPost] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Used to trigger post refresh
  
  // Use user avatar if available, otherwise fallback to blank image for new users
  const userAvatar = user?.avatarUrl || BLANK_AVATAR_IMAGE;

  useEffect(() => {
    let isMounted = true;
    async function loadPosts() {
      setLoadingPosts(true);
      try {
        const data = await apiRequest("/posts/feed");
        if (isMounted) {
          setPosts(data);
        }
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoadingPosts(false);
      }
    }
    loadPosts();
    return () => {
      isMounted = false;
    };
  }, [refreshTrigger]); // Use refreshTrigger as dependency instead of user

  // When user data changes, trigger a refresh of posts
  useEffect(() => {
    setRefreshTrigger(prev => prev + 1);
  }, [user]);

  async function handleCreatePost() {
    const text = composerText.trim();
    if (!text) {
      setError("Please add some text to your post.");
      return;
    }
    setSubmittingPost(true);
    setError("");
    try {
      const newPost = await apiRequest("/posts", {
        method: "POST",
        body: await (async () => {
          let imageUrl;
          if (composerImageFile) {
            imageUrl = await new Promise((resolve) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result);
              reader.readAsDataURL(composerImageFile);
            });
          }
          return { text, imageUrl };
        })(),
      });
      setPosts((prev) => [newPost, ...prev]);
      setComposerText("");
      setComposerImageFile(null);
      setComposerImagePreview("");
      setComposerOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmittingPost(false);
    }
  }

  function handlePostUpdated(updatedPost) {
    if (!updatedPost) return;
    setPosts((prev) =>
      prev.map((p) => (p.id === updatedPost.id ? { ...p, ...updatedPost } : p))
    );
  }

  return (
    <div className="mx-auto max-w-[1128px] px-4 md:px-6 lg:px-8 py-6 flex gap-4 w-full mt-16 bg-gray-100">
      {/* left side */}
      <div className="hidden sm:block w-[280px] shrink-0 py-2 lg:sticky lg:top-20">
        <div className="h-fit">
          <ProfileCard />
        </div>
      </div>

      {/* middle side */}
      <div className="min-w-0 flex-1 max-w-[600px]">
        <div>
          <Card>
            <div className='flex gap-2 items-center'>
              <Link to="/profile" className="shrink-0">
                <img 
                  src={userAvatar} 
                  className='rounded-4xl w-13' 
                  alt="Profile"
                />
              </Link>
              <div
                className="w-full border-1 py-3 px-3 rounded-3xl cursor-pointer hover:bg-gray-100"
                onClick={() => setComposerOpen(true)}
              >
                Start a post
              </div>
            </div>

            <div className='w-full flex mt-3'>
              <div className='flex gap-2 p-2 cursor-pointer justify-center rounded-lg w-[33%] hover:bg-gray-100'>
                <VideoCameraBackIcon />
                <div>Video</div>
              </div>
              <div className='flex gap-2 p-2 cursor-pointer justify-center rounded-lg w-[33%] hover:bg-gray-100'>
                <InsertPhotoIcon />
                <div>Image</div>
              </div>
              <div className='flex gap-2 p-2 cursor-pointer justify-center rounded-lg w-[33%] hover:bg-gray-100'>
                <ArticleIcon />
                <div>Article</div>
              </div>
            </div>

            {composerOpen && (
              <div className="mt-4 border-t border-gray-200 pt-4">
                <textarea
                  className="w-full border-1 rounded-lg px-3 py-2 text-sm min-h-[90px]"
                  placeholder="What do you want to talk about?"
                  value={composerText}
                  onChange={(e) => setComposerText(e.target.value)}
                />
                <div className="mt-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setComposerImageFile(file);
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => setComposerImagePreview(reader.result);
                        reader.readAsDataURL(file);
                      } else {
                        setComposerImagePreview("");
                      }
                    }}
                  />
                  {composerImagePreview && (
                    <img
                      src={composerImagePreview}
                      alt="preview"
                      className="mt-2 max-h-48 rounded-md object-cover"
                    />
                  )}
                </div>
                <div className="flex justify-end gap-2 mt-3">
                  <button
                    type="button"
                    className="px-3 py-1 rounded-full hover:bg-gray-100"
                    onClick={() => {
                      setComposerOpen(false);
                      setComposerText("");
                      setComposerImageFile(null);
                      setComposerImagePreview("");
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleCreatePost}
                    disabled={submittingPost}
                    className="px-4 py-1 bg-blue-700 text-white rounded-full disabled:opacity-50"
                  >
                    {submittingPost ? "Posting..." : "Post"}
                  </button>
                </div>
              </div>
            )}
          </Card>
        </div>

        {error && <div className="text-red-600 text-sm mt-3">{error}</div>}

        {loadingPosts ? (
          <div className="mt-5 text-center text-gray-500">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="mt-5 text-center text-gray-500">No posts yet. Be the first to post!</div>
        ) : (
          <div className='w-full my-5 space-y-5'>
            {posts.map((post) => (
              <PostItem key={post.id} post={post} onPostUpdated={handlePostUpdated} />
            ))}
          </div>
        )}
      </div>

      {/* right side */}
      <div className='hidden lg:block w-[320px] shrink-0 py-2 lg:sticky lg:top-20'>
        <div>
          <Card>
            <div className="text-xl">LinkedIn News</div>
            <div className="text-gray-600">Top stories</div>
            <div className="my-1">
              <div className="text-md">Buffett to remain Berkshire chair</div>
              <div className="text-xs text-gray-400">2h ago</div>
            </div>
            <div className="my-1">
              <div className="text-md">Foreign investments surge again</div>
              <div className="text-xs text-gray-400">3h ago</div>
            </div>
          </Card>
        </div>

      <div className="my-5">
        <Advertisement />
      </div>

      </div>
    </div>
  );
};

export default Posts;