import { useEffect } from "react";

function SuccessPopup({ message, onClose }) {
  useEffect(() => {
    if (!message) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      onClose();
    }, 1800);

    return () => window.clearTimeout(timeoutId);
  }, [message, onClose]);

  if (!message) {
    return null;
  }

  return (
    <div className="popup-backdrop" role="status" aria-live="polite">
      <div className="success-popup">
        <span className="success-popup-icon" aria-hidden="true">
          ✓
        </span>
        <p>{message}</p>
      </div>
    </div>
  );
}

export default SuccessPopup;
