
"use client";

interface CustomerSecurityProps {
    onChangePassword: () => void;
}

function CustomerSecurity({
    onChangePassword,
}: CustomerSecurityProps) {
    return (
        <section className="customer-security-card">

            <div className="security-header">

                <div>

                    <span className="profile-label">
                        SECURITY
                    </span>

                    <h2>
                        Password & Security
                    </h2>

                    <p>
                        Manage your account password.
                    </p>

                </div>

                <button
                    type="button"
                    className="change-password-btn"
                    onClick={onChangePassword}
                >
                    Change Password
                </button>

            </div>

        </section>
    );
}

export default CustomerSecurity;
