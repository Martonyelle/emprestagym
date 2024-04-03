import { useCallback } from "react";
import { useDataEnhancementPlugin } from "@firecms/data_enhancement";
import { User as FirebaseUser } from "firebase/auth";
import { Authenticator, FirebaseCMSApp } from "firecms";
import "typeface-rubik";
import "@fontsource/ibm-plex-mono";
import { firebaseConfig } from "./config";
import { productsCollection } from "./collections/products";

// Supondo que AuthControllerType e PathType sejam os tipos apropriados
// Substitua `any` pelos tipos corretos se disponíveis
type AuthControllerType = any;
type PathType = any;

export default function App() {
    const myAuthenticator: Authenticator<FirebaseUser> = useCallback(async ({
        user,
        authController,
    }: { user: FirebaseUser | null; authController: AuthControllerType }) => {
        if (user?.email?.includes("flanders")) {
            throw Error("Stupid Flanders!");
        }
        console.log("Allowing access to", user?.email);
        const sampleUserRoles = await Promise.resolve(["admin"]);
        authController.setExtra(sampleUserRoles);
        return true;
    }, []);

    const dataEnhancementPlugin = useDataEnhancementPlugin({
        getConfigForPath: ({ path }: { path: PathType }) => {
            return true;
        },
    });

    return <FirebaseCMSApp
        name={"Empresta Gym"}
        plugins={[dataEnhancementPlugin]}
        authentication={myAuthenticator}
        collections={[productsCollection]}
        firebaseConfig={firebaseConfig}
    />;
}
