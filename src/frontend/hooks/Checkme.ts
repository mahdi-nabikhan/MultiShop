import { useEffect, useState } from "react";
import axios from "axios";
import BACKEND_URLS from "@/utils";

export default function useCheckMe() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const check = async () => {
            try {
                await axios.get(
                    `${BACKEND_URLS}account/api/v1/me/`,
                    {
                        withCredentials: true,
                    }
                );

                setIsAuthenticated(true);
            } catch {
                setIsAuthenticated(false);
            }
        };

        check();
    }, []);

    return isAuthenticated;
}