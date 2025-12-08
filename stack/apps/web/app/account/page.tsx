"use client";

import { useState, useEffect, type JSX } from "react";
import { useTheme as useNextTheme } from "next-themes";
import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import { AnimatedBackground } from "@workspace/ui/components/shared/AnimatedBackground";
import { FloatingDots } from "@workspace/ui/components/shared/Animations";
import { Switch } from "@workspace/ui/components/switch";
import { SidebarTrigger } from "@workspace/ui/components/sidebar";
import { ConfirmationModal } from "@workspace/ui/components/shared/ConfirmationModal";
import { FormModal } from "@workspace/ui/components/shared/FormModal";
import { Input } from "@workspace/ui/components/input";
import { BsSun, BsMoon, BsKey, BsShieldCheck, BsTrash, BsPlus, BsCheckCircle } from "react-icons/bs";

interface Passkey {
  id: string;
  name: string;
  createdAt: string;
  lastUsed?: string;
}

interface TwoFactorMethod {
  id: string;
  type: "authenticator" | "sms";
  enabled: boolean;
  phone?: string;
}

const mockPasskeys: Passkey[] = [
  { id: "pk-1", name: "MacBook Pro - Touch ID", createdAt: "2025-01-01", lastUsed: "Today" },
  { id: "pk-2", name: "YubiKey 5", createdAt: "2025-01-05", lastUsed: "3 days ago" },
];

const defaultProfile = {
  name: "John Doe",
  email: "john@example.com",
};

const AccountPage = (): JSX.Element | null => {
  const { setTheme, resolvedTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);

  const [profile, setProfile] = useState(defaultProfile);
  const [originalProfile, setOriginalProfile] = useState(defaultProfile);
  const [saved, setSaved] = useState(false);

  const [twoFactor, setTwoFactor] = useState<TwoFactorMethod[]>([
    { id: "2fa-1", type: "authenticator", enabled: true },
    { id: "2fa-2", type: "sms", enabled: false, phone: "+1 (555) 123-4567" },
  ]);

  const [passkeys, setPasskeys] = useState<Passkey[]>(mockPasskeys);

  // Modal states
  const [addPasskeyModalOpen, setAddPasskeyModalOpen] = useState(false);
  const [deletePasskeyModalOpen, setDeletePasskeyModalOpen] = useState(false);
  const [selectedPasskey, setSelectedPasskey] = useState<Passkey | null>(null);
  const [newPasskeyName, setNewPasskeyName] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : true;

  if (!mounted) return null;

  const hasProfileChanges = JSON.stringify(profile) !== JSON.stringify(originalProfile);

  const handleSaveProfile = () => {
    setOriginalProfile({ ...profile });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleTwoFactor = (id: string) => {
    setTwoFactor(prev => prev.map(method =>
      method.id === id ? { ...method, enabled: !method.enabled } : method
    ));
  };

  const openDeletePasskeyModal = (passkey: Passkey) => {
    setSelectedPasskey(passkey);
    setDeletePasskeyModalOpen(true);
  };

  const handleAddPasskey = () => {
    const dateStr = new Date().toISOString().split("T")[0] ?? new Date().toISOString().substring(0, 10);
    const newPasskey: Passkey = {
      id: `pk-${Date.now()}`,
      name: newPasskeyName,
      createdAt: dateStr,
      lastUsed: "Never",
    };
    setPasskeys(prev => [...prev, newPasskey]);
    setAddPasskeyModalOpen(false);
    setNewPasskeyName("");
  };

  const handleDeletePasskey = () => {
    if (!selectedPasskey) return;
    setPasskeys(prev => prev.filter(pk => pk.id !== selectedPasskey.id));
    setDeletePasskeyModalOpen(false);
    setSelectedPasskey(null);
  };

  return (
    <div className={cn(
      "min-h-svh transition-colors relative",
      isDark ? "bg-[#0b0b0a]" : "bg-[#f5f5f4]"
    )}>
      <AnimatedBackground isDark={isDark} />
      <FloatingDots isDark={isDark} count={15} />

      <div className="relative p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <SidebarTrigger className={cn(
                "transition-all hover:scale-110 active:scale-95",
                isDark ? "text-zinc-400 hover:text-zinc-100" : "text-zinc-600 hover:text-zinc-900"
              )} />
              <div>
                <h1 className={cn(
                  "text-2xl font-light tracking-wider",
                  isDark ? "text-zinc-100" : "text-zinc-800"
                )}>
                  ACCOUNT SETTINGS
                </h1>
                <p className={cn(
                  "text-sm mt-1",
                  isDark ? "text-zinc-500" : "text-zinc-500"
                )}>
                  Manage your account and security
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className={cn(
                "transition-all hover:scale-110 active:scale-95 p-2",
                isDark
                  ? "border-zinc-700 text-zinc-400 hover:text-zinc-100 hover:border-zinc-500"
                  : "border-zinc-300 text-zinc-600 hover:text-zinc-900 hover:border-zinc-400"
              )}
            >
              {isDark ? <BsSun className="w-4 h-4" /> : <BsMoon className="w-4 h-4" />}
            </Button>
          </div>

          {/* Profile Section */}
          <div className={cn(
            "relative p-6 border mb-6",
            isDark
              ? "bg-gradient-to-b from-[#141414] via-[#0f0f0f] to-[#0a0a0a] border-zinc-200/10"
              : "bg-gradient-to-b from-white via-zinc-50 to-zinc-100 border-zinc-300"
          )}>
            <div className={cn("absolute top-0 left-0 w-2 h-2 border-t border-l", isDark ? "border-zinc-500" : "border-zinc-400")} />
            <div className={cn("absolute top-0 right-0 w-2 h-2 border-t border-r", isDark ? "border-zinc-500" : "border-zinc-400")} />
            <div className={cn("absolute bottom-0 left-0 w-2 h-2 border-b border-l", isDark ? "border-zinc-500" : "border-zinc-400")} />
            <div className={cn("absolute bottom-0 right-0 w-2 h-2 border-b border-r", isDark ? "border-zinc-500" : "border-zinc-400")} />

            <h2 className={cn(
              "text-sm font-medium uppercase tracking-wider mb-6",
              isDark ? "text-zinc-300" : "text-zinc-700"
            )}>
              Profile
            </h2>

            <div className="space-y-4">
              <div>
                <label className={cn(
                  "text-[10px] font-medium uppercase tracking-wider",
                  isDark ? "text-zinc-500" : "text-zinc-400"
                )}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                  className={cn(
                    "w-full mt-2 px-3 py-2 text-sm border outline-none transition-colors",
                    isDark
                      ? "bg-zinc-900/50 border-zinc-700/50 text-zinc-200 focus:border-zinc-500"
                      : "bg-white border-zinc-300 text-zinc-800 focus:border-zinc-400"
                  )}
                />
              </div>
              <div>
                <label className={cn(
                  "text-[10px] font-medium uppercase tracking-wider",
                  isDark ? "text-zinc-500" : "text-zinc-400"
                )}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                  className={cn(
                    "w-full mt-2 px-3 py-2 text-sm border outline-none transition-colors",
                    isDark
                      ? "bg-zinc-900/50 border-zinc-700/50 text-zinc-200 focus:border-zinc-500"
                      : "bg-white border-zinc-300 text-zinc-800 focus:border-zinc-400"
                  )}
                />
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveProfile}
              disabled={!hasProfileChanges}
              className={cn(
                "mt-6 transition-all gap-2",
                saved
                  ? isDark
                    ? "border-green-500/50 text-green-400"
                    : "border-green-400 text-green-600"
                  : isDark
                    ? "border-zinc-700 text-zinc-400 hover:text-zinc-100 hover:border-zinc-500 disabled:opacity-40"
                    : "border-zinc-300 text-zinc-600 hover:text-zinc-900 hover:border-zinc-400 disabled:opacity-40"
              )}
            >
              {saved ? (
                <>
                  <BsCheckCircle className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider">Saved</span>
                </>
              ) : (
                <span className="text-xs uppercase tracking-wider">Update Profile</span>
              )}
            </Button>
          </div>

          {/* Passkeys Section */}
          <div className={cn(
            "relative p-6 border mb-6",
            isDark
              ? "bg-gradient-to-b from-[#141414] via-[#0f0f0f] to-[#0a0a0a] border-zinc-200/10"
              : "bg-gradient-to-b from-white via-zinc-50 to-zinc-100 border-zinc-300"
          )}>
            <div className={cn("absolute top-0 left-0 w-2 h-2 border-t border-l", isDark ? "border-zinc-500" : "border-zinc-400")} />
            <div className={cn("absolute top-0 right-0 w-2 h-2 border-t border-r", isDark ? "border-zinc-500" : "border-zinc-400")} />
            <div className={cn("absolute bottom-0 left-0 w-2 h-2 border-b border-l", isDark ? "border-zinc-500" : "border-zinc-400")} />
            <div className={cn("absolute bottom-0 right-0 w-2 h-2 border-b border-r", isDark ? "border-zinc-500" : "border-zinc-400")} />

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <BsKey className={cn("w-4 h-4", isDark ? "text-zinc-400" : "text-zinc-600")} />
                <h2 className={cn(
                  "text-sm font-medium uppercase tracking-wider",
                  isDark ? "text-zinc-300" : "text-zinc-700"
                )}>
                  Passkeys
                </h2>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAddPasskeyModalOpen(true)}
                className={cn(
                  "transition-all gap-2",
                  isDark
                    ? "border-zinc-700 text-zinc-400 hover:text-zinc-100 hover:border-zinc-500"
                    : "border-zinc-300 text-zinc-600 hover:text-zinc-900 hover:border-zinc-400"
                )}
              >
                <BsPlus className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wider">Add Passkey</span>
              </Button>
            </div>

            <p className={cn(
              "text-xs mb-4",
              isDark ? "text-zinc-500" : "text-zinc-500"
            )}>
              Passkeys provide a more secure and convenient way to sign in without passwords.
            </p>

            <div className="space-y-3">
              {passkeys.map((passkey) => (
                <div
                  key={passkey.id}
                  className={cn(
                    "flex items-center justify-between p-4 border",
                    isDark ? "border-zinc-700/50 bg-zinc-900/30" : "border-zinc-200 bg-zinc-50"
                  )}
                >
                  <div>
                    <div className={cn(
                      "text-sm font-medium",
                      isDark ? "text-zinc-200" : "text-zinc-700"
                    )}>
                      {passkey.name}
                    </div>
                    <div className={cn(
                      "text-xs mt-1",
                      isDark ? "text-zinc-500" : "text-zinc-500"
                    )}>
                      Added {passkey.createdAt} • Last used: {passkey.lastUsed || "Never"}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openDeletePasskeyModal(passkey)}
                    className={cn(
                      "transition-all p-2",
                      isDark
                        ? "border-red-900/60 text-red-400/80 hover:text-red-300 hover:border-red-700"
                        : "border-red-300 text-red-600 hover:text-red-700 hover:border-red-400"
                    )}
                  >
                    <BsTrash className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Two-Factor Authentication Section */}
          <div className={cn(
            "relative p-6 border",
            isDark
              ? "bg-gradient-to-b from-[#141414] via-[#0f0f0f] to-[#0a0a0a] border-zinc-200/10"
              : "bg-gradient-to-b from-white via-zinc-50 to-zinc-100 border-zinc-300"
          )}>
            <div className={cn("absolute top-0 left-0 w-2 h-2 border-t border-l", isDark ? "border-zinc-500" : "border-zinc-400")} />
            <div className={cn("absolute top-0 right-0 w-2 h-2 border-t border-r", isDark ? "border-zinc-500" : "border-zinc-400")} />
            <div className={cn("absolute bottom-0 left-0 w-2 h-2 border-b border-l", isDark ? "border-zinc-500" : "border-zinc-400")} />
            <div className={cn("absolute bottom-0 right-0 w-2 h-2 border-b border-r", isDark ? "border-zinc-500" : "border-zinc-400")} />

            <div className="flex items-center gap-2 mb-6">
              <BsShieldCheck className={cn("w-4 h-4", isDark ? "text-zinc-400" : "text-zinc-600")} />
              <h2 className={cn(
                "text-sm font-medium uppercase tracking-wider",
                isDark ? "text-zinc-300" : "text-zinc-700"
              )}>
                Two-Factor Authentication
              </h2>
            </div>

            <p className={cn(
              "text-xs mb-4",
              isDark ? "text-zinc-500" : "text-zinc-500"
            )}>
              Add an extra layer of security to your account by requiring a second form of verification.
            </p>

            <div className="space-y-3">
              {twoFactor.map((method) => (
                <div
                  key={method.id}
                  className={cn(
                    "flex items-center justify-between p-4 border",
                    isDark ? "border-zinc-700/50 bg-zinc-900/30" : "border-zinc-200 bg-zinc-50"
                  )}
                >
                  <div>
                    <div className={cn(
                      "text-sm font-medium",
                      isDark ? "text-zinc-200" : "text-zinc-700"
                    )}>
                      {method.type === "authenticator" ? "Authenticator App" : "SMS Authentication"}
                    </div>
                    <div className={cn(
                      "text-xs mt-1",
                      isDark ? "text-zinc-500" : "text-zinc-500"
                    )}>
                      {method.type === "authenticator"
                        ? "Use an app like Google Authenticator or Authy"
                        : `Receive codes via SMS to ${method.phone}`}
                    </div>
                  </div>
                  <Switch
                    checked={method.enabled}
                    onCheckedChange={() => toggleTwoFactor(method.id)}
                    isDark={isDark}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Passkey Modal */}
      <FormModal
        open={addPasskeyModalOpen}
        onOpenChange={setAddPasskeyModalOpen}
        title="Add Passkey"
        description="Register a new passkey for passwordless authentication."
        onSubmit={handleAddPasskey}
        submitLabel="Add Passkey"
        isDark={isDark}
        isValid={newPasskeyName.trim().length >= 3}
      >
        <div className="space-y-4">
          <div>
            <label className={cn(
              "text-xs uppercase tracking-wider mb-2 block",
              isDark ? "text-zinc-400" : "text-zinc-600"
            )}>
              Passkey Name
            </label>
            <Input
              value={newPasskeyName}
              onChange={(e) => setNewPasskeyName(e.target.value)}
              placeholder="e.g., MacBook Pro - Touch ID"
              className={cn(
                "transition-all",
                isDark
                  ? "bg-zinc-900 border-zinc-700 text-zinc-100 placeholder:text-zinc-600"
                  : "bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-400"
              )}
            />
            <p className={cn(
              "text-xs mt-1",
              isDark ? "text-zinc-500" : "text-zinc-500"
            )}>
              Enter a name to identify this passkey
            </p>
          </div>
        </div>
      </FormModal>

      {/* Delete Passkey Modal */}
      <ConfirmationModal
        open={deletePasskeyModalOpen}
        onOpenChange={setDeletePasskeyModalOpen}
        title="Delete Passkey"
        description={`Are you sure you want to delete "${selectedPasskey?.name}"? You will no longer be able to sign in using this passkey.`}
        onConfirm={handleDeletePasskey}
        confirmLabel="Delete"
        variant="danger"
        isDark={isDark}
      />
    </div>
  );
};

export default AccountPage;
