import { SavedList } from "@/components/SavedList";
import { SHARE_TEXT } from "@/lib/share-constants";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Saved Looks",
  `Your saved VIRAAS products, couple looks and collections — share with “${SHARE_TEXT}”.`,
  "/saved"
);

export default function SavedPage() {
  return (
    <div className="container-page py-12 lg:py-16">
      <header className="max-w-3xl">
        <p className="kicker">Your edit</p>
        <h1 className="heading-xl mt-2">SAVED LOOKS</h1>
        <p className="mt-4 text-sm text-ink-soft">Saved locally on this device. Share any look to Web Share, Copy Link or WhatsApp — “{SHARE_TEXT}”.</p>
      </header>
      <SavedList />
    </div>
  );
}
