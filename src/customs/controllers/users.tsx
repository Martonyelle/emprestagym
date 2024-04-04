import { User } from "@firebase/auth";
import { fetchData } from "../../@shared/helpers/helpers";
import { jwtDecode } from "jwt-decode";

const getUserDataByEmail = async (email: string) => {
    return fetchData('POST', '/users/getByEmail', 'dados do usuário',
        {
            email: email
        }
    );
}
const getUserDataByAccessToken = async (accessToken: string) => {
    const decoded = jwtDecode(accessToken) as User;
    const email = decoded.email;
    return fetchData('POST', '/users/getByEmail', 'dados do usuário',
        {
            email: email
        }
    );
}

export {
    getUserDataByEmail,
    getUserDataByAccessToken
}