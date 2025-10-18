import Home from "./home/home";
import Hero from "./home/hero";
import Services from "./home/service";
import Footer from "./home/footer";

export default function Landing() {
  return (
    <div className="bg-white">
      <div className="bg-gradient-to-br from-blue-300 to-indigo-200">
        {/* Header */}
        <Home />

        {/* Hero Section */}
        <Hero />
      </div>

      {/* Services Section */}
      <Services />

      {/* Footer */}
      <Footer />
    </div>
  );
}
