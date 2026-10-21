import { InscriptionWizard } from "@/components/inscription/wizard";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <InscriptionWizard />
      </main>
      <SiteFooter />
    </div>
  );
}
