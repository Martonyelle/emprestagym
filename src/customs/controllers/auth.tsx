import { AuthController, Authenticator } from "firecms";
import { getUserDataByEmail } from "./users";
import { getLocalIp } from "../../@shared/utils";


const authenticator: Authenticator<any> = async ({
    user, 
    authController,
    dataSource,
    storageSource
}) => {
    const userEmail = user?.email ? user?.email : '';
    let userData: any;
    let validUser: boolean = false;

    if(user?.accessToken){
        localStorage.setItem('accessToken', user.accessToken);
    }

    const checkUserAndLogin = async (userEmail: string) => {
        userData = await getUserDataByEmail(userEmail);
        if (!userData.success) {
            throw new Error("Parece que tivemos algum problema em validar seu usuário, entre em contato com o suporte Guaralabs");
        } else {
            userData = userData.data;
            const ip = await getLocalIp();
            userData.ip = ip;
            
            if (userData.status !== 'active') {
                throw new Error("Seu usuário está inativo, entre em contato com o suporte Guaralabs.");
            } else {
                authController.setExtra({
                    userData: userData
                });
                return true;
            }
        }
    }

    validUser = await checkUserAndLogin(userEmail);

    return validUser;
};

export { authenticator };
