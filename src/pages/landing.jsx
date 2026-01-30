import Home from "./home/home";
import Hero from "./home/hero";
import Services from "./home/service";
import Footer from "./home/footer";
import Testimonals from "./home/testimonals";
import Client from "./home/client";
import CTS from "./home/cta-section";
import AboutPage from "./home/about";

export default function Landing() {
  return (
    <div className="bg-white">
      {/* Header */}
      <Home />

      {/* Hero Section */}
      <Hero />
      <AboutPage/>
    
      {/* Services Section */}
      <Services />
  <Client/>
      <Testimonals/>
<CTS/>
      {/* Footer */}
      <Footer />
    </div>
  );
}
