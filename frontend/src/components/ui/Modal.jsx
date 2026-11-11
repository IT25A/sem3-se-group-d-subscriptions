import { useEffect } from "react";
import ReactDOM from "react-dom";

function Modal({ isOpen, onClose, title, children }) {
    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
            onClick={onClose}
        >
            <div
                className="card w-full max-w-md mx-4 p-6 relative"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-4">
                    {title && <h2 className="text-xl font-semibold t-primary">{title}</h2>}
                    <button
                        onClick={onClose}
                        className="btn-close"
                    >
                        ✕
                    </button>
                </div>
                {children}
            </div>
        </div>,
        document.body
    );
}

export default Modal;