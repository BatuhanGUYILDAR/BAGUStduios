import { Route, Routes } from 'react-router-dom';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import About from './pages/About';
import Contact from './pages/Contact';
import Education from './pages/Education';
import Home from './pages/Home';
import ProjectDetail from './pages/ProjectDetail';
import Projects from './pages/Projects';

function App() {
  return (
    <div className="min-h-screen bg-ink text-slate-100">
      <Navbar />
      <main className="pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/education" element={<Education />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
