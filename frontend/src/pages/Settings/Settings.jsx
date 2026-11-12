import { useState } from "react";
import ConfirmationModal from "../../components/ui/ConfirmationModal.jsx";

function Settings({ onAccountDeleted }) {
    const [showConfirm, setShowConfirm] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    const handleDeleteAccount = async () => {
        try {
            const res = await fetch("/api/users", {
                method: "DELETE",
                credentials: "include",
            });
            if (!res.ok) {
                const data = await res.json();
                setDeleteError(data.error ?? "Failed to delete account");
                setShowConfirm(false);
                return;
            }
            onAccountDeleted();
        } catch {
            setDeleteError("Network error. Please try again.");
            setShowConfirm(false);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-row items-center justify-between">
                <h3 className="text-sm font-semibold t-primary">Delete User</h3>
                {deleteError && <p className="text-sm t-error">{deleteError}</p>}
                <button
                    className="btn btn-delete"
                    onClick={() => setShowConfirm(true)}
                >
                    Delete
                </button>
            </div>
            <ConfirmationModal
                isOpen={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={handleDeleteAccount}
                title="Delete account"
                message="Are you sure? This will permanently delete your account and all your data."
            />
        </div>
    );
}

export default Settings;