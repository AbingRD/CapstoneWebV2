import { useNavigate, useSearchParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { AppContext } from "../../utils/context";
import { checkUserData } from "../../utils/functions";


function ProtectedRoute({ children }) {
    const navigate = useNavigate();
    const { userData, setUserData, setIsLoggedIn } = useContext(AppContext);
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        if (!checkUserData(searchParams, setSearchParams, setUserData, setIsLoggedIn)) {
            navigate("/");
        }
    }, []);

    return <>{children}</>;
}


export default ProtectedRoute;
