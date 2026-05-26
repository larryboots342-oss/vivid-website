import { Construction } from "lucide-react";

export default function AdminContentPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-16 h-16 rounded-2xl bg-vivid-primary/10 border border-vivid-primary/20 flex items-center justify-center mb-6">
        <Construction className="w-8 h-8 text-vivid-primary" />
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">Content Management</h1>
      <p className="text-vivid-textMuted max-w-md">
        A CMS integration is required to edit marketing copy from the admin panel.
        For now, content changes should be made directly in the codebase and deployed.
      </p>
    </div>
  );
}
