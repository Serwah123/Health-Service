
function HomePage() {
  return (
    <div className="container">
      <header className="header">
        <div className="logo">Health Project</div>
        <nav className="nav">
          <button>Home</button>
          <button>Dashboard</button>
          <button>Profile</button>
          <button>Settings</button>
          <button>Logout</button>
        </nav>
      </header>
      <div className="body">
        <aside className="sidebar">
          <ul>
            <li>Overview</li>
            <li>Reports</li>
            <li>Analytics</li>
            <li>Support</li>
          </ul>
        </aside>
        <main className="content">
          <h1>Welcome to the Home Page</h1>
          <p>This is your landing page.</p>
        </main>
      </div>
    </div>
  );
}

export default HomePage;