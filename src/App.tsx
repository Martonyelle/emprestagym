import { useCallback } from "react";
import { User as FirebaseUser } from "firebase/auth";
import { Authenticator, CMSView, EntityCollectionsBuilder, FirebaseCMSApp } from "firecms";
import "typeface-rubik";
import "@fontsource/ibm-plex-mono";
import { firebaseConfig } from "./config";
import { equipmentsCollection } from "./collections/equipments";
import { clientsCollection } from "./collections/client/client";
import { allocationsCollection } from "./collections/allocation";
import { usersCollection } from "./collections/users";
import RentalDashboard from "./customs/views/data-analitics.tsx/rentalDashboard";


type AuthControllerType = any;
type PathType = any;

interface AuthController {
    extra: any;
  }
  
  interface PathConfig {
    path: string;
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

    const collectionsBuilder: EntityCollectionsBuilder = useCallback(() => {
        return [
            equipmentsCollection,
            clientsCollection,
            allocationsCollection,
            usersCollection,
        ];
    }, []);     

    const customViews: CMSView[] = [
        {
          path: "alugados",
          name: "Alugados",
          icon: "MonitorHeart",
          group: "Gestão",
          description: "Verifique os aparelhos alugados",
          view: <RentalDashboard />,
        },
    ];


    return <FirebaseCMSApp
        name={"Empresta Gym"}
        views={customViews}
        authentication={myAuthenticator}
        collections={collectionsBuilder}
        firebaseConfig={firebaseConfig}
    />;
}
