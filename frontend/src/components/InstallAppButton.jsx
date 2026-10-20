
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

    try {
      await installPrompt.prompt();
      const choice = await installPrompt.userChoice;

      if (choice.outcome === "accepted") {
        setInstallPrompt(null);
      }
    } catch (error) {
      console.error("App installation failed:", error);
    }
  }

  return (
    <button
      type="button"
      className="install-app-btn"
      onClick={handleInstall}
      disabled={installed}
      title={installed ? "App is already installed" : "Install UAF EduPortal"}
      aria-label={installed ? "App already installed" : "Install UAF EduPortal"}
    >
      <svg
        className="install-app-icon"
        viewBox="0 0 24 24"
        width="21"
        height="21"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <path d="m7 10 5 5 5-5" />
        <path d="M12 15V3" />
      </svg>

      <span className="install-app-label">
        {installed ? "App Installed" : "Install App"}
      </span>
    </button>
  );
}
