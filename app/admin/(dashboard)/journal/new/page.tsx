import JournalEditor from "@/components/admin/JournalEditor";
import { getLang, tServer } from "@/lib/i18n/server";

export default function NewJournalPostPage() {
  const lang = getLang();
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-6">{tServer("adminNewJournalPost", lang)}</h1>
      <JournalEditor />
    </div>
  );
}
