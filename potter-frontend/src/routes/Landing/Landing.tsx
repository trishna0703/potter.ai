
import HeroSection from "./components/HeroSection";
import WhoCanUseSection from "./components/WhoCanUseSection";
import FeatureCarousel from "./components/FeatureCarousel";
import HowItWorksSection from "./components/HowItWorksSection";


const Landing = () => {
  return (
    <main>
      <HeroSection />

      <WhoCanUseSection />

      <section id="features" className="scroll-mt-20">
        <FeatureCarousel />
      </section>

      <HowItWorksSection />
    </main>
  );
};

export default Landing;
