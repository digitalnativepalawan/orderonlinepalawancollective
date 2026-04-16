import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface AdminLoginModalProps {
  open: boolean;
  onClose: () => void;
  onLogin: () => void;
}

export default function AdminLoginModal({ open, onClose, onLogin }: AdminLoginModalProps) {
  const [passkey, setPasskey] = useState("");

  const handleSubmit = () => {
    if (passkey === "5309") {
      onLogin();
      setPasskey("");
    } else {
      alert("Wrong passkey");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Admin Access</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <Input
            type="password"
            placeholder="Enter passkey 5309"
            value={passkey}
            onChange={(e) => setPasskey(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="flex-1">
              Login
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
