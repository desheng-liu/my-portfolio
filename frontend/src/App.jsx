import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Home from './pages/Home';
import Resume from './pages/Resume';
import Projects from './pages/Projects';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={scrolled ? 'scrolled' : ''}>
      <NavLink to="/" className="nav-logo">
        <span>Desheng Liu</span>
      </NavLink>
      <div className="nav-links">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/resume">Resume</NavLink>
        <NavLink to="/projects">Projects</NavLink>
        <NavLink to="/blog">Blog</NavLink>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
      </Routes>
      <footer>
        <span>© {new Date().getFullYear()} Desheng Liu</span>
        <div style={{ display: 'flex', gap: 24 }}>
          <a href="https://github.com/desheng-liu" target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://linkedin.com/in/liudesheng" target="_blank" rel="noreferrer">LinkedIn</a>
          <a href="mailto:desheng.liu@example.com">Email</a>
        </div>
      </footer>
    </BrowserRouter>
  );
}
