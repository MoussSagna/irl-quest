import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import './index.css';

const Home = () => <main className="min-h-screen p-8"><h1 className="text-3xl font-bold">IRL Quest</h1><p className="mt-2">Web foundation ready.</p><Link className="mt-4 inline-block underline" to="/about">About</Link></main>;
const About = () => <main className="min-h-screen p-8"><h1 className="text-2xl font-bold">About</h1><Link className="underline" to="/">Home</Link></main>;
createRoot(document.getElementById('root')!).render(<StrictMode><BrowserRouter><Routes><Route path="/" element={<Home />} /><Route path="/about" element={<About />} /></Routes></BrowserRouter></StrictMode>);
