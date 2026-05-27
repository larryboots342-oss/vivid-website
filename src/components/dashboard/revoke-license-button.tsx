"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export default function RevokeLicenseButton({
  licenseId,
  licenseKey,
}: {
  licenseId: string;
  licenseKey: string;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/user/licenses?id=${licenseId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        toast.success("License revoked");
        window.location.reload();
      } else {
        toast.error(data.error || "Failed to revoke license");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="gap-2 text-vivid-accent hover:text-vivid-accent hover:bg-vivid-accent/10 border-vivid-accent/20"
      >
        <Trash2 className="w-4 h-4" />
        Revoke
      </Button>
      <ConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleConfirm}
        title="Revoke License?"
        description={`This will deactivate license ${licenseKey}. You will lose access immediately.`}
        confirmText="Revoke License"
        isLoading={loading}
      />
    </>
  );
}
