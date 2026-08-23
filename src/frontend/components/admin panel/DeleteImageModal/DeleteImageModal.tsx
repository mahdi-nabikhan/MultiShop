"use client";

import "./DeleteImageModal.css";


interface DeleteImageModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;

}


export default function DeleteImageModal({
    open,
    onClose,
    onConfirm
}: DeleteImageModalProps) {
    if (!open) return null;


    return (

        <div className="delete-image-overlay">


            <div className="delete-image-modal">


                <h2>
                    Delete Image
                </h2>


                <p>
                    Are you sure you want to delete this image?
                </p>



                <div className="delete-image-actions">


                    <button

                        className="cancel-delete-image"

                        onClick={onClose}

                    >

                        Cancel

                    </button>



                    <button

                        className="confirm-delete-image"

                        onClick={onConfirm}

                    >

                        Delete

                    </button>


                </div>



            </div>


        </div>

    );

}