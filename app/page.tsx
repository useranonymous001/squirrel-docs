import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { InstallationSection } from "@/components/installation-section"
import { QuickStartSection } from "@/components/quick-start-section"
import { FeaturesSection } from "@/components/features-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen min-w-screen  bg-background">
        <Header />
      <main>
        <HeroSection />
        <InstallationSection />
        <QuickStartSection />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  )
}
