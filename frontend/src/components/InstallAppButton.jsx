import { useEffect, useState } from "react";

export default function InstallAppButton() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    if (standalone) setInstalled(true);

    const handleBeforeInstall = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };

    const handleInstalled = () => {
      setInstalled(true);
      setInstallPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  async function handleInstall() {
    if (installed) return;

    if (!installPrompt) {
      alert(
        "Install karne ke liye Chrome/Edge ka menu kholen aur 'Install app' ya 'Add to Home Screen' select karein. Agar option nazar nahi aa raha, website ko HTTPS par kholen aur dobara check karein."
      );
      return;
    }

    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;

    if (choice.outcome === "accepted") {
      setInstallPrompt(null);
    }
  }

  return (
    <button
      type="button"
      className="install-app-btn"
      onClick={handleInstall}
      disabled={installed}
      title={installed ? "App is already installed" : "Install UAF EduPortal"}
    >
      <span aria-hidden="true">↓</span>{" "}
      {installed ? "App Installed" : "Install App"}
    </button>
  );
}
