import "./App.css";
import Navbar from "./Navbar";
import Hero from "./Hero";
import Features from "./Features";
import Highlights from "./Highlights";
import Pricing from "./Pricing";
import Footer from "./Footer";

function App() {
  return (
    <div className="app">
      <Navbar />
      <Hero />
      <Features />
      <Highlights />
      <Pricing />
      <Footer />
    </div>
  );
}

export default App;