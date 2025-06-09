import { ThemeToggle } from "@/components/theme/ThemeToggle";

export default function SettingsPage() {
  return (
    <>
      <div className="flex h-screen rounded-xl border-1 shadow-lg backdrop-blur-lg">
        <div className="flex w-full justify-between p-4">
          <p className="">Appearance</p>
          <ThemeToggle variant="compact" />
        </div>
      </div>
    </>
  );
}
