import Modal from "./Modal.jsx";

function ConfirmationModal({ isOpen, onClose, onConfirm, title, message }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="flex flex-col gap-4">
                <p className="t-secondary text-sm">{message}</p>
                <div className="flex gap-3 justify-end">
                    <button onClick={onClose} className="btn btn-secondary">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className="btn btn-delete">
                        Delete
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export default ConfirmationModal;