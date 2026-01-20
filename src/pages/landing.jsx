import Home from "./home/home";
import Hero from "./home/hero";
import Services from "./home/service";
import Footer from "./home/footer";

export default function Landing() {
  return (
    <div className="bg-white">
      {/* Header */}
      <Home />

      {/* Hero Section */}
      <Hero />

      {/* Services Section */}
      <Services />

      {/* Footer */}
      <Footer />
    </div>
  );
}
