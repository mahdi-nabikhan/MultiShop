
"use client";

import useDeleteAddress from "@/hooks/customer/useDeleteAddress";

import "./DeleteAddressModal.css";

interface Props {
    open: boolean;
    onClose: () => void;
    addressId: number;
}

export default function DeleteAddressModal({
    open,
    onClose,
    addressId,
}: Props) {

    const {
        mutate: deleteAddressMutation,
        isPending,
    } = useDeleteAddress(addressId);

    if (!open) {
        return null;
    }

    const handleDelete = () => {

        deleteAddressMutation(undefined, {
            onSuccess: () => {
                onClose();
            },
        });

    };

    return (
        <div className="delete-modal-overlay">

            <div className="delete-address-modal">

                <h2>
                    Delete Address?
                </h2>

                <p>
                    Are you sure you want to delete this address?
                    This action cannot be undone.
                </p>

                <div className="delete-actions">

                    <button
                        className="cancel-delete"
                        onClick={onClose}
                        disabled={isPending}
                    >
                        Cancel
                    </button>

                    <button
                        className="confirm-delete"
                        onClick={handleDelete}
                        disabled={isPending}
                    >
                        {isPending
                            ? "Deleting..."
                            : "Delete"
                        }
                    </button>

                </div>

            </div>

        </div>
    );
}
