import React from 'react';
import Form from '@rjsf/mui';
import { Typography, Container, Button } from "@mui/material";
import validator from "@rjsf/validator-ajv8";

const ReadOnlyTextWidget = ({ label, value }) => (
  <>
    <Typography variant="subtitle1"><b>{label}</b></Typography>
    <Typography variant="body1" style={{
      maxWidth: "100%",
      textOverflow: "ellipsis",
      overflow: "hidden",
    }} title={value}>{value}</Typography>
  </>
);

const schema: any = {
  type: "object",
  properties: {
    issuedBy: { type: "string", title: "Issued by" },
    issuedOn: { type: "string", title: "Issued on" },
    vaultUUID: { type: "string", title: "Vault UUID" },
    cheqdDID: { type: "string", title: "Cheqd DID" },
    appUsed: { type: "string", title: "App or device used" },
    aiToolsUsed: { type: "array", title: "AI tools used", items: { type: "string" } },
    actionsPerformed: { type: "array", title: "Actions performed", items: { type: "string" } },
    cloudContentType: { type: "string", title: "Cloud Content Type" },
    cloudHash: { type: "string", title: "Cloud Hash" },
    cloudUrl: { type: "string", title: "Cloud Data URL" },
    cloudMetadata: { type: "string", title: "Cloud Metadata Description" },
    cloudSize: { type: "string", title: "Cloud Data Size" }
  }
};

const uiSchema: any = {
  issuedBy: { "ui:widget": ReadOnlyTextWidget },
  issuedOn: { "ui:widget": ReadOnlyTextWidget },
  vaultUUID: { "ui:widget": ReadOnlyTextWidget },
  cheqdDID: { "ui:widget": ReadOnlyTextWidget },
  appUsed: { "ui:widget": ReadOnlyTextWidget },
  aiToolsUsed: { "ui:options": { addable: false, removable: false } },
  actionsPerformed: { "ui:options": { addable: false, removable: false } },
  cloudContentType: { "ui:widget": ReadOnlyTextWidget },
  cloudHash: { "ui:widget": ReadOnlyTextWidget },
  cloudUrl: { "ui:widget": async (props) => <img src={props.value} style={{ width: '100%', height: 'auto' }} /> },
  cloudMetadata: { "ui:widget": ReadOnlyTextWidget },
  cloudSize: { "ui:widget": ReadOnlyTextWidget },
  "ui:options": { style: { maxWidth: "80vw" } }
};

function formatDateStringToLocal(dateString) {
  if (!dateString) return "Unknown";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit', timeZoneName: 'short'
  }).format(date);
}

function extractData(assertions) {
  if (!assertions || !Array.isArray(assertions.data)) return { aiTools: [], actions: [], cloudData: {} };

  const aiTools = new Set();
  const actions = new Set();
  let cloudData: any = {};

  assertions.data.forEach(assertion => {
    if (assertion?.data?.actions) {
      assertion.data.actions.forEach(action => {
        if (action.softwareAgent) aiTools.add(action.softwareAgent);
        if (action.action) actions.add(action.action);
        if (action.digitalSourceType) actions.add(action.digitalSourceType);
      });
    }
    console.log('assertion', assertion);
    if (assertion.label === "c2pa.cloud-data") {
      cloudData = {
        contentType: assertion.data?.content_type || "N/A",
        hash: assertion.data?.location?.hash || "N/A",
        url: assertion.data?.location?.url || "N/A",
        metadata: assertion.data?.metadata?.description || "N/A",
        size: assertion.data?.size ? assertion.data.size.toLocaleString() + " bytes" : "N/A"
      };
    }
  });

  return {
    aiTools: Array.from(aiTools),
    actions: Array.from(actions),
    cloudData
  };
}

function ContentCredentialManifestForm({ manifest, viewMoreUrl }) {
  if (!manifest) return <Typography variant="h6">No manifest data available.</Typography>;

  const { aiTools, actions, cloudData } = extractData(manifest.assertions);

  const formData = {
    issuedBy: manifest.signatureInfo.issuer,
    issuedOn: formatDateStringToLocal(manifest.signatureInfo.time),
    vaultUUID: manifest.vaultUUID || "Not available",
    cheqdDID: manifest.cheqdDID || "Not available",
    appUsed: manifest.claimGenerator?.split(" ")[0]?.replace(/_/g, ' ').replace(/\//g, ' '),
    aiToolsUsed: aiTools,
    actionsPerformed: actions,
    cloudContentType: cloudData.contentType,
    cloudHash: cloudData.hash,
    cloudUrl: cloudData.url,
    cloudMetadata: cloudData.metadata,
    cloudSize: cloudData.size
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h6" gutterBottom>
        Content Credential Information
      </Typography>
      <Form 
        validator={validator} 
        schema={schema} 
        uiSchema={uiSchema} 
        formData={formData} 
        noHtml5Validate
      >
        <Button style={{
          marginTop: "20px",
          backgroundColor: "#add4ef",
          color: "#1e3c72"
        }} variant="contained" href={viewMoreUrl} target="_blank">
            View more
        </Button>
      </Form>
    </Container>
  );
}

export default ContentCredentialManifestForm;
