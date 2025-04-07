import { Box, Typography, Divider, Avatar, Chip, Tooltip, Popper, IconButton, Link } from "@mui/material";
import { CalendarToday, AccountBalanceWallet, Fingerprint, InfoOutlined, CopyAll, Check, OpenInNew } from "@mui/icons-material";
import { SocialIcon } from 'react-social-icons';
import React, { useEffect, useState } from "react";
import ContentFingerprints from "./ContentFingerprint";
import ColorBarcode from "./ColorBarcode";

// interface VeridaProfile {
//   id: didKey;
//   name: username;
//   image: avatar;
//   description: user bio;
//   website: website;
// }

export const renderDIDDetails = ({ data, renderProps }: any) => {
  const { isDarkMode } = renderProps;
  const [contentResource, setContentResource] = useState<any>(null);
  const [verifiedIdentities, setVerifiedIdentities] = useState<any[]>([]);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [colorCodeAnchorEl, setColorCodeAnchorEl] = useState<HTMLElement | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const fetchContentRegistration = async () => {
      const resources = data?.didDocumentMetadata?.linkedResourceMetadata || [];

      const contentResources = resources.filter((r: any) => r.resourceType === "Content-Registration-Record");
      if (!contentResources.length) return <Typography p={2}>No content registered for this resource.</Typography>;

      const latest = contentResources.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())[0];
      try {
        const res = await fetch(`https://resolver.cheqd.net/1.0/identifiers/${latest.resourceURI}`);
        const json = await res.json();
        
        // Extract the registration record from the response
        const registrationRecord = json.didResolutionMetadata?.contentStream 
          ? JSON.parse(json.didResolutionMetadata.contentStream)
          : json;
        
        // Get the registered content from the credential subject
        const registeredContent = registrationRecord.vc?.credentialSubject?.registeredContent?.[0] || {};
        
        // Set verified identities from the credential subject
        if (registrationRecord.vc?.credentialSubject?.verifiedIdentities) {
          setVerifiedIdentities(registrationRecord.vc.credentialSubject.verifiedIdentities);
        }
        
        setContentResource({ 
          ...registeredContent,
          issuer: registrationRecord.vc?.issuer,
          issuanceDate: registrationRecord.vc?.issuanceDate,
          expirationDate: registrationRecord.vc?.expirationDate
        });
      } catch (error) {
        console.error("Error fetching content registration:", error);
      }
    };

    fetchContentRegistration();
  }, [data]);

  if (!contentResource) return <Typography p={2}>Loading content info…</Typography>;

  return (
    <Box p={2} sx={{
      maxWidth: 420,
      backgroundColor: isDarkMode ? "#1c2a35" : "#c9b36d",
      color: isDarkMode ? "#add4ef" : "#1c2a35",
      borderRadius: 2,
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    }}>

      {/* CONTENT PREVIEW */}
      <Box my={2}>
        <iframe 
          src={contentResource.publicPath} 
          style={{ width: "100px", borderRadius: 4, border: 'none', overflow: 'hidden' }} 
        />
        <Typography title={contentResource.fileName} variant="body1" fontWeight={500} mt={1} style={{ maxWidth: '90%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{contentResource.fileName}</Typography>
        <Box display="flex" flexDirection="column" gap={0.5} mt={0.5}>
          <Box display="flex" alignItems="center">
            <Typography variant="caption">Mnemonic ID: {contentResource.mnemonicId}</Typography>
            <IconButton
              size="small"
              title="Copy Mnemonic ID"
              style={{ marginLeft: '5px', color: isDarkMode ? '#add4ef' : '#1c2a35' }}
              onClick={() => {
                navigator.clipboard.writeText(contentResource.mnemonicId);
                setCopied('mnemonicId');
                setTimeout(() => setCopied(null), 2000);
              }}
            >
              {copied === 'mnemonicId' ? <Check fontSize="small" /> : <CopyAll fontSize="small" />}
            </IconButton>
          </Box>
          <Box display="flex" alignItems="center">
            <Typography variant="caption" style={{ maxWidth: '90%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Content Hash: {contentResource.contentHash}</Typography>
            <IconButton
              size="small"
              title="Copy Content Hash"
              style={{ marginLeft: '5px', color: isDarkMode ? '#add4ef' : '#1c2a35' }}
              onClick={() => {
                navigator.clipboard.writeText(contentResource.contentHash);
                setCopied('contentHash');
                setTimeout(() => setCopied(null), 2000);
              }}
            >
              {copied === 'contentHash' ? <Check fontSize="small" /> : <CopyAll fontSize="small" />}
            </IconButton>
          </Box>
          {contentResource.perceptualHashes && (
            <Box style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Chip 
                onMouseEnter={(event) => setAnchorEl(event.currentTarget)}
                onMouseLeave={() => setAnchorEl(null)}
                label="Perceptual Hashing" 
                size="small" 
                variant="outlined" 
                color="info" 
                sx={{ alignSelf: 'flex-start', mt: 0.5 }}
              />
              <Tooltip title={
                    <Box>
                    <Typography textAlign="left" fontWeight="bold" variant="subtitle2" sx={{ color: '#add4ef' }}>
                        The following are color-coded perceptual fingerprints based on the file's contents we calculated using <a style={{ color: '#f39c12' }} href="https://github.com/jaehl/blockhash" target="_blank" rel="noopener noreferrer"> blockhash's Phash algorithm </a> and then are translated into hex codes to create unique color-coded fingerprints for each file.
                    </Typography>
                    <Typography textAlign="left" fontWeight="bold" variant="subtitle2" sx={{ color: '#add4ef' }} style={{ marginTop: '10px' }}>
                        Each fingerprint is a degree more accurate than the last, with the soft print being the least accurate and the precise print being the most accurate.
                    </Typography>
                    <Typography textAlign="left" fontWeight="bold" variant="subtitle2" sx={{ color: '#add4ef' }} style={{ marginTop: '10px' }}>
                        {contentResource.perceptualHashes.soft}
                    </Typography>
                    <Typography textAlign="left" fontWeight="bold" variant="subtitle2" sx={{ color: '#add4ef' }} style={{ marginTop: '10px' }}>
                        {contentResource.perceptualHashes.medium}
                    </Typography>
                    <Typography textAlign="left" fontWeight="bold" variant="subtitle2" sx={{ color: '#add4ef' }} style={{ marginTop: '10px' }}>
                        {contentResource.perceptualHashes.precise}
                    </Typography>
                    </Box>
                }>
                    <InfoOutlined color='primary' fontSize="small" style={{ marginLeft: '10px', cursor: 'pointer' }} />
                </Tooltip>
              <Popper open={Boolean(anchorEl)} anchorEl={anchorEl} placement="top" style={{ zIndex: 1301, backgroundColor: '#1c2a35' }}>
                <ContentFingerprints softPerceptualHash={contentResource.perceptualHashes.soft} mediumPerceptualHash={contentResource.perceptualHashes.medium} precisePerceptualHash={contentResource.perceptualHashes.precise} />
              </Popper>
            </Box>
          )}
          {contentResource.colorCode && (
            <Box style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Chip 
                    onMouseEnter={(event) => setColorCodeAnchorEl(event.currentTarget)}
                    onMouseLeave={() => setColorCodeAnchorEl(null)}
                    label="Color Code" 
                    size="small" 
                    variant="outlined" 
                    color="info" 
                    sx={{ alignSelf: 'flex-start', mt: 1 }}
                />
               
                <Tooltip title={
                    <Box maxWidth={300}>
                        <Typography variant="body2" style={{ color: '#add4ef' }}>
                            We generate a unique hash for each file and convert that hash into a distinct hex color. This acts as a "visual fingerprint."
                        </Typography>
                        <Typography variant="body2" mt={1} style={{ color: '#add4ef' }}>
                            The barcode above represents 24 fragments of the file, each encoded as a color—giving you a visual way to verify authenticity.
                        </Typography>
                    </Box>
                }>
                    <InfoOutlined color='primary' fontSize="small" style={{ marginLeft: '10px', cursor: 'pointer' }} />
                </Tooltip>
                 <IconButton style={{
                    height: 40,
                    width: 40,
                }} onClick={() => {
                    navigator.clipboard.writeText(contentResource.colorCode);
                    setCopied('colorCode');
                    setTimeout(() => setCopied(null), 2000);
                }}>
                    {copied === 'colorCode' ? <Check fontSize="small" /> : <CopyAll fontSize="small" style={{ color: isDarkMode ? '#add4ef' : '#1c2a35' }}/>}
                </IconButton>
                <Popper open={Boolean(colorCodeAnchorEl)} anchorEl={colorCodeAnchorEl} placement="top" style={{ zIndex: 1301, backgroundColor: '#1c2a35' }}>
                    <ColorBarcode contentHash={contentResource.contentHash} colorCode={contentResource.colorCode} color={contentResource.color} isDarkMode={isDarkMode} />
                </Popper> 
            </Box>
          )}
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} style={{ backgroundColor: isDarkMode ? "#add4ef" : "#1c2a35" }} />

      {/* CREATOR PROFILE */}
      <Box>
        <Typography variant="subtitle2">Creator Profile</Typography>
        <Box display="flex" alignItems="center" gap={1} mt={0.5}>
          <Avatar src={contentResource.issuer?.image || "https://originvault.io/favicon.ico"} sx={{ width:64, height:64 }} />
          <Typography variant="subtitle1" fontWeight={600}>{contentResource.issuer?.name || "OriginVault"}</Typography>
        </Box>
        <Typography variant="body2">{contentResource.issuer?.description || "OriginVault is a platform for creating and managing decentralized identities."}</Typography>
        <Box display="flex" alignItems="center" gap={1} mt={0.5}>
            <Link 
                href={contentResource.issuer?.website} 
                target="_blank" rel="noopener noreferrer" 
                style={{ 
                    color: isDarkMode ? '#add4ef' : '#1c2a35', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '5px', 
                    fontSize: '14px', 
                    cursor: 'pointer' 
                }}
                onClick={() => {
                    window.open(contentResource.issuer?.website || "https://create.originvault.me", "_blank");
                }}
            >
                <Typography variant="body2">{contentResource.issuer?.website || "https://create.originvault.me"}</Typography>
                <OpenInNew fontSize="small" style={{ marginLeft: '5px' }} />
            </Link>
        </Box>
      </Box>

      
      {/* GOVERNMENT ID */}
      {verifiedIdentities.some((v) => v.type === "cawg.document_verification") && (
        <Box mt={2}>
          <Chip
            icon={<Fingerprint />}
            label="Government ID Verified"
            color="success"
            variant="outlined"
            style={{ backgroundColor: isDarkMode ? "#add4ef" : "transparent" }}
          />
        </Box>
      )}

      {/* SOCIAL IDENTITIES */}
      {verifiedIdentities.length > 0 && (
        <Box mt={2}>
          <Typography variant="subtitle2">Linked Accounts</Typography>
          <Box display="flex" flexWrap="wrap" gap={1} mt={0.5}>
            {verifiedIdentities
              .filter((v) => v.type === "cawg.social_media")
              .map((identity, i) => (
                <Tooltip key={i} title={`${identity.provider.name}: ${identity.username || identity.address}`}>
                  <Box>
                    <SocialIcon
                      url={`https://${identity.provider.id}.com/`}
                      style={{ height: 32, width: 32 }}
                    />
                    <IconButton
                      size="small"
                      title="Copy Provider Name"
                      style={{ marginLeft: '5px', color: isDarkMode ? '#add4ef' : '#1c2a35' }}
                      onClick={() => {
                        navigator.clipboard.writeText(identity.provider.name);
                        setCopied(identity.provider.name);
                        setTimeout(() => setCopied(null), 2000);
                      }}
                    >
                      {copied === identity.provider.name ? <Check fontSize="small" /> : <CopyAll fontSize="small" />}
                    </IconButton>
                  </Box>
                </Tooltip>
              ))}
          </Box>
        </Box>
      )}

      {/* DID + WALLET */}
      <Box mt={2}>
        {verifiedIdentities
          .filter((v) => v.type === "cawg.crypto_wallet")
          .map((wallet, i) => (
            <Box key={i} display="flex" alignItems="center" gap={1} mt={0.5}>
              <AccountBalanceWallet fontSize="small" />
              <Typography variant="body2" sx={{ wordBreak: 'break-all', maxWidth: '90%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {wallet.uri || wallet.address}
              </Typography>
              <IconButton
                size="small"
                title="Copy Wallet Address"
                style={{ marginLeft: '5px', color: isDarkMode ? '#add4ef' : '#1c2a35' }}
                onClick={() => {
                  navigator.clipboard.writeText(wallet.address);
                  setCopied(wallet.address);
                  setTimeout(() => setCopied(null), 2000);
                }}
              >
                {copied === wallet.address ? <Check fontSize="small" /> : <CopyAll fontSize="small" />}
              </IconButton>
            </Box>
          ))}
      </Box>

      <Divider sx={{ my: 2 }} style={{ backgroundColor: isDarkMode ? "#add4ef" : "#1c2a35" }} />

      <Box display="flex" alignItems="center" gap={1} mb={1}>
        <Avatar src={contentResource.issuer?.image || "https://originvault.io/favicon.ico"} sx={{ width: 32, height: 32 }} />
        <Typography variant="subtitle1" fontWeight={600}>
          Verified by {contentResource.issuer?.name || "OriginVault"}
        </Typography>
      </Box>

      {/* ISSUE INFO */}
      <Box display="flex" alignItems="center" gap={1} mt={2}>
        <CalendarToday fontSize="small" />
        <Typography variant="body2">
          Issued on {new Date(contentResource.issuanceDate || contentResource.createdAt).toLocaleString()}
        </Typography>
      </Box>

      {contentResource.expirationDate && (
        <Box display="flex" alignItems="center" gap={1} mt={1}>
          <CalendarToday fontSize="small" color="warning" />
          <Typography variant="body2">
            Expires on {new Date(contentResource.expirationDate).toLocaleString()}
          </Typography>
        </Box>
      )}
    </Box>
  );
};
