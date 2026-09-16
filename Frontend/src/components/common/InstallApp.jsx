import { useEffect, useState } from "react";
import "./style/InstallApp.css";


function InstallApp() {
  const [installPrompt, setInstallPrompt] = useState(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  };

  const handleClose = () => {
    setInstallPrompt(null);
  };

  if (!installPrompt) {
    return null;
  }
  console.log(installPrompt)

  return (
    <div className="install-overlay">
      <div className="install-popup">
        <button className="install-close" onClick={handleClose}>
          ×
        </button>
        <div className="install-icon">
          <img src="/logo.png" alt=" Not" />
        </div>
        <h2>Install Friends Chat</h2>
        <p>
          Install Friends Chat on your device for a faster and better chatting experience.
        </p>
        <div className="install-actions">
          <button className="install-later" onClick={handleClose}>
            Not now
          </button>
          <button className="install-button" onClick={handleInstall}>
            Install App
          </button>
        </div>
      </div>
    </div>
  );
}

export default InstallApp;
