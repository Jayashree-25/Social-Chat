import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../components/UserWrapper";
import { FeedContext } from "../components/FeedContext";
import { auroraStyle } from "../styles/AuthStyles";

const ProfilePage = () => {
    const { currentUser } = useContext(UserContext) || {};
    const { posts } = useContext(FeedContext) || {};
    const [userPosts, setUserPosts] = useState([]);

    useEffect(() => {
        const styleTag = document.createElement("style");
        styleTag.innerHTML = auroraStyle;
        document.head.appendChild(styleTag);
        return () => {
            document.head.removeChild(styleTag);
        };
    }, []);

    useEffect(() => {
        if (currentUser?.username && posts.length > 0) {
            const filteredPosts = posts.filter(
                (post) => post.username.toLowerCase() === currentUser.username.toLowerCase()
            );
            setUserPosts(filteredPosts);
        }
    }, [currentUser, posts]);

    if (!currentUser) {
        return <p style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Loading profile...</p>;
    }
    const userInitial = currentUser.username ? currentUser.username.charAt(0).toUpperCase() : '?';

    const stats = {
        posts: userPosts.length,
        followers: "1,234",
        following: "567"
    };

    return (
        <div style={{ padding: "2rem", color: 'white' }}>
            {/* Profile Header */}
            <div style={{
                maxWidth: '900px',
                margin: '0 auto 2rem auto',
                display: 'flex',
                alignItems: 'center',
                gap: '2rem',
                padding: '2rem',
                background: "rgba(25, 25, 25, 0.6)",
                backdropFilter: "blur(15px)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: "20px",
                boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
            }}>
                {/* Left: Profile Picture */}
                <div style={{
                    width: '150px',
                    height: '150px',
                    borderRadius: '50%',
                    background: 'linear-gradient(to right, #8e2de2, #4a00e0)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '5rem',
                    fontWeight: 'bold',
                    flexShrink: 0
                }}>
                    {userInitial}
                </div>

                {/* Right: User Info */}
                <div style={{ flexGrow: 1 }}>
                    {/* Top Row: Username and Edit Button */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 400 }}>{currentUser.username}</h1>
                        <button style={{
                            padding: '8px 16px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            color: 'white',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: 500
                        }}>
                            Edit Profile
                        </button>
                    </div>

                    {/* Middle Row: Stats */}
                    <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem' }}>
                        <p style={{ margin: 0, fontSize: '1rem' }}><strong style={{ fontWeight: 600 }}>{stats.posts}</strong> posts</p>
                        <p style={{ margin: 0, fontSize: '1rem' }}><strong style={{ fontWeight: 600 }}>{stats.followers}</strong> followers</p>
                        <p style={{ margin: 0, fontSize: '1rem' }}><strong style={{ fontWeight: 600 }}>{stats.following}</strong> following</p>
                    </div>

                    {/* Bottom: Bio */}
                    <div>
                        <p style={{ margin: 0, fontWeight: 600 }}>{currentUser.name || currentUser.username}</p>
                        <p style={{ margin: '0.25rem 0 0 0', color: 'rgba(255, 255, 255, 0.7)' }}>
                            This is a sample bio. Users will be able to edit this later! #ReactDeveloper
                        </p>
                    </div>
                </div>
            </div>

            {/* User's Posts Section */}
            <div>
                <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', maxWidth: '900px', margin: '0 auto 1.5rem auto' }}>Your Posts</h2>
                {userPosts.length > 0 ? (
                    userPosts.map(post => (
                        <div key={post.id} style={{
                            maxWidth: '700px',
                            margin: '0 auto 24px auto',
                            background: "rgba(255, 255, 255, 0.08)",
                            border: "1px solid rgba(255, 255, 255, 0.15)",
                            borderRadius: "16px",
                            padding: '24px'
                        }}>
                            <p>{post.text}</p>
                        </div>
                    ))
                ) : (
                    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                        <p style={{ color: 'rgba(255,255,255,0.7)' }}>You haven't created any posts yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProfilePage;
