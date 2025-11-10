import React, { useContext, useEffect, useState } from "react";
import Card from "../../components/Card/card";
import Advertisement from "../../components/Advertisement/advertisement";
import { DEFAULT_AVATAR_IMAGE, DEFAULT_COVER_IMAGE, BLANK_AVATAR_IMAGE, BLANK_COVER_IMAGE } from "../../constants/userAssets";
import { AuthContext } from "../../context/AuthContext";
import { apiRequest } from "../../utils/api";
import PostItem from "../../components/PostItem/postItem";
import { useNavigate } from "react-router-dom";
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import EditIcon from '@mui/icons-material/Edit';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

// Function to format post data to match what PostItem expects
const formatPost = (post) => {
  return {
    id: post._id || post.id,
    text: post.text,
    imageUrl: post.imageUrl,
    createdAt: post.createdAt,
    author: post.author
      ? {
          id: post.author._id || post.author.id,
          name: post.author.name,
          avatarUrl: post.author.avatarUrl,
        }
      : undefined,
    likesCount: post.likesCount || post.likes?.length || 0,
    liked: post.liked || false,
    commentsCount: post.commentsCount || post.comments?.length || 0,
  };
};

const Profile = () => {
  const { user, logout, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [userPosts, setUserPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [error, setError] = useState("");
  const [composerOpen, setComposerOpen] = useState(false);
  const [composerText, setComposerText] = useState("");
  const [composerImageFile, setComposerImageFile] = useState(null);
  const [composerImagePreview, setComposerImagePreview] = useState("");
  const [submittingPost, setSubmittingPost] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingCoverImage, setEditingCoverImage] = useState(false);
  const [editingProfileImage, setEditingProfileImage] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    headline: "",
    location: "",
    about: ""
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoadingProfile(true);
        const userData = await apiRequest("/users/me");
        setProfileData(userData);
        // Initialize edit form with current profile data
        setEditFormData({
          name: userData.name || "",
          headline: userData.headline || "",
          location: userData.location || "",
          about: userData.about || ""
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingProfile(false);
      }
    };

    const fetchUserPosts = async () => {
      try {
        setLoadingPosts(true);
        const posts = await apiRequest("/users/me/posts");
        // Format posts to match what PostItem expects
        const formattedPosts = posts.map(formatPost);
        setUserPosts(formattedPosts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchUserProfile();
    fetchUserPosts();
  }, []);

  const handleCreatePost = async () => {
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
        body: {
          text,
          imageUrl: composerImageFile ? URL.createObjectURL(composerImageFile) : null
        }
      });

      // Format the new post to match what PostItem expects
      const formattedPost = formatPost(newPost);
      setUserPosts(prev => [formattedPost, ...prev]);
      setComposerText("");
      setComposerImageFile(null);
      setComposerImagePreview("");
      setComposerOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmittingPost(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleShareProfile = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Profile link copied to clipboard!");
  };

  const handleEditProfile = () => {
    setEditingProfile(true);
  };

  const handleCancelEdit = () => {
    // Reset form to current profile data
    setEditFormData({
      name: profileData.name || "",
      headline: profileData.headline || "",
      location: profileData.location || "",
      about: profileData.about || ""
    });
    setEditingProfile(false);
  };

  const handleSaveProfile = async () => {
    try {
      const updatedUser = await apiRequest("/users/me", {
        method: "PUT",
        body: editFormData
      });
      
      setProfileData(updatedUser);
      setEditingProfile(false);
      
      // Update the AuthContext user data
      setUser(updatedUser);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCoverImageEdit = () => {
    setEditingCoverImage(true);
  };

  const handleProfileImageEdit = () => {
    setEditingProfileImage(true);
  };

  const handleCoverImageSave = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // In a real app, you would upload the file to a server
        // For now, we'll just use a data URL
        const reader = new FileReader();
        reader.onload = async (event) => {
          const imageDataUrl = event.target.result;
          
          // Update the cover image in the backend
          const updatedUser = await apiRequest("/users/me/cover", {
            method: "PUT",
            body: { coverUrl: imageDataUrl }
          });
          
          setProfileData(updatedUser);
          setEditingCoverImage(false);
          
          // Update the AuthContext user data
          setUser(updatedUser);
        };
        reader.readAsDataURL(file);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleProfileImageSave = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // In a real app, you would upload the file to a server
        // For now, we'll just use a data URL
        const reader = new FileReader();
        reader.onload = async (event) => {
          const imageDataUrl = event.target.result;
          
          // Update the profile image in the backend
          const updatedUser = await apiRequest("/users/me/avatar", {
            method: "PUT",
            body: { avatarUrl: imageDataUrl }
          });
          
          setProfileData(updatedUser);
          setEditingProfileImage(false);
          
          // Update the AuthContext user data with a new object reference
          setUser({...updatedUser});
        };
        reader.readAsDataURL(file);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleCancelImageEdit = () => {
    setEditingCoverImage(false);
    setEditingProfileImage(false);
  };

  // Render loading state
  if (loadingProfile) {
    return (
      <div className="bg-gray-100 mt-16 flex justify-center items-center h-screen">
        <div className="text-xl">Loading profile...</div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="bg-gray-100 mt-16 flex justify-center items-center h-screen">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  // Use profile data if available, otherwise fallback to context user or defaults
  // For new users without uploaded images, use blank images
  const displayCoverImage = profileData?.coverUrl || BLANK_COVER_IMAGE;
  const displayAvatar = profileData?.avatarUrl || BLANK_AVATAR_IMAGE;
  const displayName = profileData?.name || user?.name || "New User";
  const displayHeadline = profileData?.headline || "Add your headline";
  const displayLocation = profileData?.location || "Add your location";
  const displayConnections = profileData?.connectionsCount || 0;

  return (
    <div className="bg-gray-100 mt-16">
      <div className="mx-auto max-w-[1128px] px-4 md:px-6 lg:px-8 py-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-4 items-start">
        {/* Left/Main column */}
        <div className="min-w-0 flex-1 space-y-5">
          {/* Hero/Profile header */}
          <Card>
            <div className="relative">
              {editingCoverImage ? (
                <div className="relative">
                  <img
                    className="w-full h-48 md:h-64 object-cover rounded-t-md"
                    src={displayCoverImage}
                    alt="cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="text-center">
                      <label className="cursor-pointer bg-white text-black px-4 py-2 rounded-lg flex items-center gap-2">
                        <CameraAltIcon />
                        <span>Upload Cover Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleCoverImageSave}
                        />
                      </label>
                      <button
                        className="mt-2 text-white underline"
                        onClick={handleCancelImageEdit}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <img
                    className="w-full h-48 md:h-64 object-cover rounded-t-md"
                    src={displayCoverImage}
                    alt="cover"
                  />
                  <button
                    className="absolute top-4 right-4 bg-white bg-opacity-80 rounded-full p-2 hover:bg-opacity-100"
                    onClick={handleCoverImageEdit}
                  >
                    <CameraAltIcon />
                  </button>
                </div>
              )}
              
              {editingProfileImage ? (
                <div className="absolute -bottom-8 left-6">
                  <div className="relative">
                    <img
                      className="w-32 h-32 rounded-full border-4 border-white object-cover"
                      src={displayAvatar}
                      alt="avatar"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                      <div className="text-center">
                        <label className="cursor-pointer bg-white text-black px-3 py-1 rounded-lg flex items-center gap-1 text-sm">
                          <CameraAltIcon fontSize="small" />
                          <span>Upload</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleProfileImageSave}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="absolute -bottom-8 left-6">
                  <img
                    className="w-32 h-32 rounded-full border-4 border-white object-cover"
                    src={displayAvatar}
                    alt="avatar"
                  />
                  <button
                    className="absolute bottom-2 right-2 bg-white rounded-full p-1 hover:bg-gray-100"
                    onClick={handleProfileImageEdit}
                  >
                    <CameraAltIcon fontSize="small" />
                  </button>
                </div>
              )}
            </div>
            <div className="pt-12 px-6 pb-4">
              {editingProfile ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleInputChange}
                    className="text-2xl font-semibold w-full border rounded px-2 py-1"
                    placeholder="Your name"
                  />
                  <input
                    type="text"
                    name="headline"
                    value={editFormData.headline}
                    onChange={handleInputChange}
                    className="text-gray-600 w-full border rounded px-2 py-1"
                    placeholder="Headline"
                  />
                  <input
                    type="text"
                    name="location"
                    value={editFormData.location}
                    onChange={handleInputChange}
                    className="text-gray-600 w-full border rounded px-2 py-1"
                    placeholder="Location"
                  />
                  <div className="text-blue-800 font-semibold mt-1">{displayConnections} Connections</div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button 
                      className="px-4 py-2 bg-blue-800 text-white rounded-lg"
                      onClick={handleSaveProfile}
                    >
                      Save
                    </button>
                    <button 
                      className="px-4 py-2 bg-white border rounded-lg"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-semibold">{displayName}</div>
                    <button 
                      className="text-gray-500 hover:text-gray-700"
                      onClick={handleEditProfile}
                    >
                      <EditIcon />
                    </button>
                  </div>
                  <div className="text-gray-600">{displayHeadline}</div>
                  <div className="text-gray-600">{displayLocation}</div>
                  <div className="text-blue-800 font-semibold mt-1">{displayConnections} Connections</div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button className="px-4 py-2 bg-blue-800 text-white rounded-lg">Open to</button>
                    <button 
                      className="px-4 py-2 bg-white border rounded-lg"
                      onClick={handleShareProfile}
                    >
                      Share Profile
                    </button>
                    <button 
                      className="px-4 py-2 bg-white border rounded-lg"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Analytics */}
          <div>
            <Card>
              <div className="px-6 py-4">
                <div className="text-xl font-semibold mb-3">Analytics</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="p-3 rounded-md bg-gray-50">
                    <div className="text-gray-500">Profile views</div>
                    <div className="text-blue-800 font-semibold text-lg">28</div>
                  </div>
                  <div className="p-3 rounded-md bg-gray-50">
                    <div className="text-gray-500">Post impressions</div>
                    <div className="text-blue-800 font-semibold text-lg">28</div>
                  </div>
                  <div className="p-3 rounded-md bg-gray-50">
                    <div className="text-gray-500">Search appearances</div>
                    <div className="text-blue-800 font-semibold text-lg">4</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* About */}
          <div>
            <Card>
              <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="text-xl font-semibold mb-2">About</div>
                  {!editingProfile && (
                    <button 
                      className="text-gray-500 hover:text-gray-700"
                      onClick={handleEditProfile}
                    >
                      <EditIcon />
                    </button>
                  )}
                </div>
                {editingProfile ? (
                  <textarea
                    name="about"
                    value={editFormData.about}
                    onChange={handleInputChange}
                    className="w-full border rounded px-2 py-1 h-32"
                    placeholder="About you"
                  />
                ) : (
                  <p className="text-gray-700 leading-relaxed">
                    {profileData?.about || "Add information about yourself"}
                  </p>
                )}
              </div>
            </Card>
          </div>

          {/* Experience */}
          <div>
            <Card>
              <div className="px-6 py-4">
                <div className="text-xl font-semibold mb-3">Experience</div>
                <div className="space-y-5">
                  <div>
                    <div className="font-semibold">Data Analytics Intern</div>
                    <div className="text-gray-600">Vodafone Idea Foundation (VOIS for Tech Program)</div>
                    <div className="text-gray-500 text-sm">Sep 2025 - Oct 2025 · 2 mos</div>
                    <p className="text-gray-700 mt-1">
                      Worked on data analytics with a focus on LLMs. Performed preprocessing,
                      visualization, and analysis to derive insights.
                    </p>
                  </div>
                  <div>
                    <div className="font-semibold">Web Development Intern</div>
                    <div className="text-gray-600">Infotact Solutions</div>
                    <div className="text-gray-500 text-sm">Jun 2025 - Aug 2025 · 3 mos</div>
                    <p className="text-gray-700 mt-1">
                      Built responsive web interfaces, integrated REST APIs, and collaborated using
                      Git/GitHub in an agile setup.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Education */}
          <div>
            <Card>
              <div className="px-6 py-4">
                <div className="text-xl font-semibold mb-3">Education</div>
                <div>
                  <div className="font-semibold">
                    Lloyd Institute of Engineering & Technology
                  </div>
                  <div className="text-gray-600">
                    Bachelor of Technology – BTech, Computer Science
                  </div>
                  <div className="text-gray-500 text-sm">Aug 2022 – May 2026</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Licenses & Certifications */}
          <div>
            <Card>
              <div className="px-6 py-4">
                <div className="text-xl font-semibold mb-3">Licenses & certifications</div>
                <div>
                  <div className="font-semibold">Microsoft: Fundamentals of Generative AI</div>
                  <div className="text-gray-500 text-sm">Issued Sep 2024</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Projects */}
          <div>
            <Card>
              <div className="px-6 py-4">
                <div className="text-xl font-semibold mb-3">Projects</div>
                <div>
                  <div className="font-semibold">Image Caption Generator</div>
                  <div className="text-gray-500 text-sm">Jan 2025 – Jan 2025</div>
                  <p className="text-gray-700 mt-1">
                    Implemented an image captioning system using the BLIP Transformer model to
                    generate accurate textual descriptions from images.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Skills */}
          <div>
            <Card>
              <div className="px-6 py-4">
                <div className="text-xl font-semibold mb-3">Skills</div>
                <div className="flex flex-wrap gap-3">
                  {["React JS", "Node JS", "Express JS", "MongoDB"].map((s) => (
                    <div key={s} className="px-3 py-1 rounded-md bg-blue-100 text-blue-900 text-sm">
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Activity */}
          <div>
            <Card>
              <div className="px-6 py-4">
                <div className="text-xl font-semibold mb-3">Activity</div>
                <div className="flex gap-2 text-sm">
                  <div className="px-3 py-1 rounded-full bg-green-700 text-white">Posts</div>
                  <div className="px-3 py-1 rounded-full bg-gray-100">Comments</div>
                  <div className="px-3 py-1 rounded-full bg-gray-100">Images</div>
                </div>
                <button 
                  className="mt-4 px-4 py-2 bg-white border rounded-lg"
                  onClick={() => setComposerOpen(true)}
                >
                  Create a post
                </button>
                
                {composerOpen && (
                  <div className="mt-4 border-t border-gray-200 pt-4">
                    <textarea
                      className="w-full border-1 rounded-lg px-3 py-2 text-sm min-h-[90px]"
                      placeholder="What do you want to talk about?"
                      value={composerText}
                      onChange={(e) => setComposerText(e.target.value)}
                    />
                    <div className="mt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <InsertPhotoIcon />
                        <span>Choose Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
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
                      </label>
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
                
                {error && <div className="text-red-600 text-sm mt-3">{error}</div>}
                
                <div className="mt-5">
                  {loadingPosts ? (
                    <div className="text-center text-gray-500">Loading posts...</div>
                  ) : userPosts.length === 0 ? (
                    <div className="text-center text-gray-500">No posts yet. Be the first to post!</div>
                  ) : (
                    <div className="space-y-5">
                      {userPosts.map((post) => (
                        <PostItem key={post.id} post={post} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Right column */}
        <div className="hidden lg:block w-[320px] shrink-0 sticky top-20 space-y-5">
          <div>
            <Advertisement />
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;