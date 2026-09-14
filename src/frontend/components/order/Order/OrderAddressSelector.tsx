"use client";

interface OrderAddress {
    id: number;
    state: string;
    city: string;
    postal_code: string;
    customer: {
        username: string;
    };
}

interface OrderAddressSelectorProps {
    addresses: OrderAddress[];
    selectedAddress: number | null;
    onSelect: (addressId: number) => void;
}

function OrderAddressSelector({
    addresses,
    selectedAddress,
    onSelect,
}: OrderAddressSelectorProps) {
    return (
        <div className="address-section">

            <h2>
                📍 Select Shipping Address
            </h2>

            <p>
                Choose where your order
                should be delivered.
            </p>

            <div className="address-list">

                {addresses.map((address) => (
                    <label
                        key={address.id}
                        className={
                            `address-card ${
                                selectedAddress === address.id
                                    ? "active-address"
                                    : ""
                            }`
                        }
                    >
                        <input
                            type="radio"
                            checked={
                                selectedAddress === address.id
                            }
                            onChange={() =>
                                onSelect(address.id)
                            }
                        />

                        <div>
                            <h4>
                                {address.state}
                                {" / "}
                                {address.city}
                            </h4>

                            <span>
                                Postal Code:{" "}
                                {address.postal_code}
                            </span>
                        </div>
                    </label>
                ))}

            </div>

        </div>
    );
}

export default OrderAddressSelector;