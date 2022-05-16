import "./App.css";
import "antd/dist/antd.min.css";
import React, { useEffect, useState } from "react";
import { Route, Routes,useNavigate } from "react-router-dom";
import { CreateCampaign } from "./Components/Organisation/CreateCampaign.js";
import { CampaignsDashPage } from "./Components/campaignDash/campaignsDashPage.js";
import { DonorCampaignsDashPage } from "./Components/Donor/donorCampaignsDashPage";
import { DonateCampaign } from "./Components/Donor/DonateCampaign.js";
import { TrackDonations } from "./Components/Donor/TrackDonations.js";
import LandingPage from "./Components/LandingPage/LandingPage";
import { Firebase,db } from "./firebase.js";
import { DonationHistory } from "./Components/DonationHistory/DonationHistory.js";
import { EditCampaign } from "./Components/CRUDCampaign/EditCampaign";
import { AddPost } from "./Components/CRUDCampaign/AddPost";
import { DropOffDonation } from "./Components/Donor/DropOffDonation.js";
import QRScannerPage from "./Components/QrScannerComponent/QRScannerPage";
import StatusUpdaterPage from "./Components/QrScannerComponent/StatusUpdaterPage";

function App() {
    const [user, setUser] = useState(null);

    const navigate = useNavigate();
    const onAuthStateChanged = async () => {
        const user = Firebase.auth().currentUser;
        console.log(user.uid);
        let donorRef = db.collection("Donor");
        await donorRef
            .doc(user.uid)
            .get()
            .then((firestoreDoc) => {
                console.log(firestoreDoc);
                if (!firestoreDoc.exists) {
                    console.log("User does not exist in donor database");
                } else {
                    navigate("/campaigns");
                }
            });

        let orgRef = db.collection("Organisations");
        await orgRef
            .doc(user.uid)
            .get()
            .then((firestoreDoc) => {
                if (!firestoreDoc.exists) {
                    console.log("User does not exist in organisation database");
                } else {
                    navigate("/campaigns/org");
                }
            });

      };
      useEffect(() => {
        const subscriber = Firebase.auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
      }, []);

    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/campaigns/create" element={<CreateCampaign />} />
            <Route path="/campaigns/org" element={<CampaignsDashPage />} />
            <Route
                path="/campaigns/org/:campaignId/edit"
                element={<EditCampaign />}
            />
            <Route
                path="/campaigns/org/:campaignId/post"
                element={<AddPost />}
            />
            <Route path="/campaigns" element={<DonorCampaignsDashPage />} />
            {/* <Route path="/donations/history" element={<DonationHistory />} /> */}
            <Route path="/donations" element={<DonationHistory />} />
            <Route path="/campaigns/:id/donate" element={<DonateCampaign />} />
            <Route
                path="/campaigns/:id/donate/dropoff"
                element={<DropOffDonation />}
            />
            <Route path="/campaigns/org/scan" element={<QRScannerPage />} />
            <Route
                path="/packages/modifyStatus"
                element={<StatusUpdaterPage />}
            />
        </Routes>
    );
}

export default App;
