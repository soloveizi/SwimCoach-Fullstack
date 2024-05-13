
import './App.css';
import Post from './Post';
import {Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import IndexPage from './pages/IndexPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { UserContextProvidor } from './UserContext';
import CreatePost from './pages/CreatePost';
import PostPage from './pages/PostPage';
import EditPage from './pages/EditPost';

function App() {
  return (
    
    <UserContextProvidor>
      <div className="background-blur"></div>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage/>} />
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/register" element={<RegisterPage/>} />
          <Route path="/create" element={<CreatePost/>} />
          <Route path="/post/:id" element={<PostPage/>} />
          <Route path="/edit/:id" element={<EditPage/>} />
        </Route>
      </Routes>
    </UserContextProvidor>
  );
}

export default App;
