
"use client";

interface CustomerProfileInfoProps {
    profile: {
        id: number;
        username: string;
    };
    editing: boolean;
    editData: {
        username: string;
    };
    isUpdating: boolean;
    isError: boolean;
    onEdit: () => void;
    onChange: (
        e: React.ChangeEvent<HTMLInputElement>
    ) => void;
    onSubmit: (
        e: React.FormEvent<HTMLFormElement>
    ) => void;
    onCancel: () => void;
}

function CustomerProfileInfo({
    profile,
    editing,
    editData,
    isUpdating,
    isError,
    onEdit,
    onChange,
    onSubmit,
    onCancel,
}: CustomerProfileInfoProps) {
    return (
        <section className="customer-profile-card">

            <div className="customer-profile-header">

                <div>
                    <span className="profile-label">
                        ACCOUNT
                    </span>

                    <h1>
                        My Profile
                    </h1>

                    <p>
                        Manage your account
                        information.
                    </p>
                </div>

                {!editing && (
                    <button
                        type="button"
                        className="edit-profile-btn"
                        onClick={onEdit}
                    >
                        Edit Profile
                    </button>
                )}

            </div>

            {!editing ? (
                <div className="customer-profile-info">

                    {/* Username */}

                    <div className="profile-info-row">

                        <div className="profile-info-label">
                            Username
                        </div>

                        <div className="profile-info-value">
                            {profile.username}
                        </div>

                    </div>

                    {/* Customer ID */}

                    <div className="profile-info-row">

                        <div className="profile-info-label">
                            Customer ID
                        </div>

                        <div className="profile-info-value">
                            #{profile.id}
                        </div>

                    </div>

                    {/* Account Type */}

                    <div className="profile-info-row">

                        <div className="profile-info-label">
                            Account Type
                        </div>

                        <div className="profile-info-value">
                            <span className="customer-badge">
                                Customer
                            </span>
                        </div>

                    </div>

                    {/* Status */}

                    <div className="profile-info-row">

                        <div className="profile-info-label">
                            Status
                        </div>

                        <div className="profile-info-value">
                            <span className="active-badge">
                                Active
                            </span>
                        </div>

                    </div>

                </div>
            ) : (
                <form
                    onSubmit={onSubmit}
                    className="customer-profile-form"
                >

                    <div className="form-group">

                        <label>
                            Username
                        </label>

                        <input
                            type="text"
                            name="username"
                            value={editData.username}
                            onChange={onChange}
                            required
                        />

                    </div>

                    {/* Update Error */}

                    {isError && (
                        <p className="form-error">
                            Failed to update profile.
                        </p>
                    )}

                    <div className="profile-form-actions">

                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={onCancel}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="save-profile-btn"
                            disabled={isUpdating}
                        >
                            {isUpdating
                                ? "Saving..."
                                : "Save Changes"}
                        </button>

                    </div>

                </form>
            )}

        </section>
    );
}

export default CustomerProfileInfo;
