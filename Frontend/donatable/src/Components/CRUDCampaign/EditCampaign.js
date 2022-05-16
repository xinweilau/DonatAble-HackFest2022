import React, { useEffect, useState } from "react";
import { Form, Input, Button, DatePicker, Row, Col, message } from "antd";
import { OrganisationLayout } from "../Layout/OrganisationLayout";
import moment from "moment";
import { useParams } from "react-router-dom";
import CampaignForm from "../Organisation/CampaignForm";
import { db } from "../../firebase.js";
import { useNavigate } from "react-router-dom";

const { TextArea } = Input;
const { RangePicker } = DatePicker;

// here because idk why gh cant detect
export function EditCampaign() {
    const navigate = useNavigate();
    const { campaignId } = useParams();
    const [data, setData] = useState({});

    useEffect(() => {
        db.collection("Campaigns")
            .doc(campaignId)
            .get()
            .then((CampaignSnapshot) => {
                if (CampaignSnapshot.exists) {
                    setData(() => {
                        const res = CampaignSnapshot.data();
                        return {
                            ...res,
                            campaignPeriod: [
                                moment(res.startDate.toDate()),
                                moment(res.endDate.toDate()),
                            ],
                            campaignDescription: res.description,
                            collectionPoint: res.collPoints,
                            itemCategories: res.categories,
                        };
                    });
                }
            });
    }, [campaignId]);

    const updateCampaign = (values) => {
        message.loading(
            { content: "Updating Campaign...", key: "updating" },
            0
        );

        // pre-processing

        const updatedData = {
            startDate: values.campaignPeriod[0].toDate(),
            endDate: values.campaignPeriod[1].toDate(),
            description: values.campaignDescription,
            collPoints: values.collectionPoint,
            categories: values.itemCategories,
        };

        // delete updatedData.dragger;
        // delete updatedData.campaignPeriod;

        db.collection("Campaigns")
            .doc(campaignId)
            .update(updatedData)
            .then((res) => {
                message.success({
                    content: "Campaign Updated!",
                    key: "updating",
                });

                navigate(-1);
            })
            .catch((err) => {
                message.error({
                    content: "Error Updating Campaign",
                    key: "updating",
                });
            });
    };

    return (
        <OrganisationLayout>
            <h2>{`Edit ${data.campaignName || ""}`}</h2>
            <CampaignForm data={data} onSubmit={updateCampaign} />
        </OrganisationLayout>
    );
}
