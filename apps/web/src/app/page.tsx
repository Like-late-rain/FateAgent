import { HomeHero } from '@/components/home/hero';
import { HomeFeatures } from '@/components/home/features';
import { HomeSteps } from '@/components/home/steps';
import { HomeDisclaimer } from '@/components/home/disclaimer';
import { HomeCta } from '@/components/home/cta';
import { HomeFooter } from '@/components/home/footer';

export default function HomePage() {
  return (
    <div className="grid-overlay">
      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-16">
        <HomeHero />
        <HomeFeatures />
        <HomeSteps />
        <HomeDisclaimer />
        <HomeCta />
        <HomeFooter />
      </div>
    </div>
  );
}
