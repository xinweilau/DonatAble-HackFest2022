import { CampaignForm } from "./CampaignForm.js";
import { OrganisationLayout } from "../Layout/OrganisationLayout";

export const CreateCampaign = () => (
    <OrganisationLayout>
        <h1>Create Campaign</h1>
        <CampaignForm />
    </OrganisationLayout>
);

export default CreateCampaign;
