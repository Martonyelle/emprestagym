import { useCallback } from "react";
import { useDataEnhancementPlugin } from "@firecms/data_enhancement";
import { User as FirebaseUser } from "firebase/auth";
import { Authenticator, EntityCollectionsBuilder, FirebaseCMSApp } from "firecms";
import "typeface-rubik";
import "@fontsource/ibm-plex-mono";
import { firebaseConfig } from "./config";
import { equipamentsCollection } from "./collections/equipaments";
import { clientsCollection } from "./collections/client";

// Supondo que AuthControllerType e PathType sejam os tipos apropriados
// Substitua `any` pelos tipos corretos se disponíveis
type AuthControllerType = any;
type PathType = any;

interface AuthController {
    extra: any; // Substitua `any` pelo tipo correto se disponível
  }
  
  interface PathConfig {
    path: string; // Exemplo básico, ajuste conforme necessário
  }

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

    const collectionsBuilder: EntityCollectionsBuilder = useCallback(() => {
        return [
            equipamentsCollection,
            clientsCollection,
        ];
    }, []);     


    return <FirebaseCMSApp
        name={"Empresta Gym"}
        plugins={[dataEnhancementPlugin]}
        authentication={myAuthenticator}
        collections={collectionsBuilder}
        firebaseConfig={firebaseConfig}
    />;
}
