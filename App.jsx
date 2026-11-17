import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE = 'http://localhost:5000/api';

function App() {
  const [profile, setProfile] = useState({ username: '', email: '', bio: '' });
  const [accounts, setAccounts] = useState([]);
  const [posts, setPosts] = useState([]);
  
  const [activeModal, setActiveModal] = useState(null); 
  const [newPlatform, setNewPlatform] = useState('Facebook');
  const [newHandle, setNewHandle] = useState('');

  const fetchData = async () => {
    try {
      const [profRes, accRes, postRes] = await Promise.all([
        axios.get(`${API_BASE}/profile`),
        axios.get(`${API_BASE}/accounts`),
        axios.get(`${API_BASE}/posts`)
      ]);
      setProfile(profRes.data);
      setAccounts(accRes.data);
      setPosts(postRes.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    await axios.put(`${API_BASE}/profile`, profile);
    setActiveModal(null);
    fetchData();
  };

  const handleAddAccount = async (e) => {
    e.preventDefault();
    if (!newHandle) return;
    await axios.post(`${API_BASE}/accounts`, {
      platform: newPlatform,
      account_handle: newHandle
    });
    setNewHandle('');
    setActiveModal(null);
    fetchData();
  };

  const corePlatforms = ['Facebook', 'Twitter', 'Instagram'];

  return (
    <div className="dashboard-container">
      <header className="top-bar">
        <div className="left-controls">
          <button className="circle-btn" onClick={() => setActiveModal('profile')}>
            Your Profile for This
          </button>
          <button className="circle-btn" onClick={() => setActiveModal('settings')}>
            Settings
          </button>
        </div>

        <button className="add-account-btn" onClick={() => setActiveModal('addAccount')}>
          Add another account from different social media
        </button>
      </header>

      <main className="platforms-grid">
        {corePlatforms.map((platform) => {
          const platformFeed = posts.filter(p => p.platform === platform && p.post_type === 'feed');
          const ownPosts = posts.filter(p => p.platform === platform && p.post_type === 'own_post');

          return (
            <section key={platform} className="platform-column">
              <div className={`platform-banner banner-${platform}`}>
                {platform}
              </div>

              <div className="dark-box">
                <h3>Your feed</h3>
                {platformFeed.map(item => (
                  <div key={item.id} className="post-item">
                    <div className="post-meta"><span>{item.author}</span></div>
                    <div>{item.content}</div>
                  </div>
                ))}
              </div>

              <div className="dark-box">
                <h3>Your posts</h3>
                {ownPosts.map(item => (
                  <div key={item.id} className="post-item">
                    <div className="post-meta"><span>{item.author}</span></div>
                    <div>{item.content}</div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </main>

      <section className="combined-feed-box">
        <h2>Combined Feed</h2>
        {posts.map((post) => (
          <div key={post.id} className="post-item">
            <div className="post-meta">
              <strong>[{post.platform}] {post.author}</strong>
              <span>{post.post_type === 'own_post' ? 'Your Post' : 'Feed Activity'}</span>
            </div>
            <div>{post.content}</div>
          </div>
        ))}
      </section>

      {activeModal === 'profile' && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>Your Application Profile</h3>
            <p><strong>Name:</strong> {profile.username}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Bio:</strong> {profile.bio}</p>
            <h4>Connected Accounts ({accounts.length})</h4>
            <ul>
              {accounts.map(acc => (
                <li key={acc.id}>{acc.platform}: {acc.account_handle}</li>
              ))}
            </ul>
            <div className="modal-actions">
              <button onClick={() => setActiveModal(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'settings' && (
        <div className="modal-overlay">
          <form className="modal-card" onSubmit={handleSaveSettings}>
            <h3>Account Settings</h3>
            <label>Display Name</label>
            <input 
              value={profile.username} 
              onChange={(e) => setProfile({...profile, username: e.target.value})} 
            />
            <label>Email</label>
            <input 
              value={profile.email} 
              onChange={(e) => setProfile({...profile, email: e.target.value})} 
            />
            <label>Bio</label>
            <textarea 
              value={profile.bio} 
              onChange={(e) => setProfile({...profile, bio: e.target.value})} 
            />
            <div className="modal-actions">
              <button type="button" onClick={() => setActiveModal(null)}>Cancel</button>
              <button type="submit">Save Settings</button>
            </div>
          </form>
        </div>
      )}

      {activeModal === 'addAccount' && (
        <div className="modal-overlay">
          <form className="modal-card" onSubmit={handleAddAccount}>
            <h3>Connect Social Media Account</h3>
            <label>Platform</label>
            <select value={newPlatform} onChange={(e) => setNewPlatform(e.target.value)}>
              <option value="Facebook">Facebook</option>
              <option value="Twitter">Twitter</option>
              <option value="Instagram">Instagram</option>
              <option value="LinkedIn">LinkedIn</option>
            </select>
            <label>Account Handle / Username</label>
            <input 
              placeholder="@username" 
              value={newHandle} 
              onChange={(e) => setNewHandle(e.target.value)} 
              required 
            />
            <div className="modal-actions">
              <button type="button" onClick={() => setActiveModal(null)}>Cancel</button>
              <button type="submit">Connect Account</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;