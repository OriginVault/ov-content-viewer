import dotenv from 'dotenv';
import { parentStore, createResource } from '@originvault/ov-id-sdk';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

dotenv.config();

const registrationRecord = {
  "iss": "did:cheqd:mainnet:123456789abcdef",
  "sub": "urn:uuid:0a7f3452-d5cd-4a6a-9876-2e4f74db3dfb",
  "nbf": 1712412000,
  "exp": 1715004000,
  "iat": 1712412000,
  "jti": "0a7f3452-d5cd-4a6a-9876-2e4f74db3dfb",
  "vc": {
    "@context": [
      "https://www.w3.org/2018/credentials/v1"
    ],
    "type": [
      "VerifiableCredential", "ContentRegistration"
    ],
    "issuer": {
      "id": "did:cheqd:mainnet:123456789abcdef",
      "name": "@originvault/ov-vault-agent",
      "image": "https://originvault.io/favicon.ico"
    },
    "issuanceDate": "2025-04-06T15:00:00.000Z",
    "expirationDate": "2025-05-06T15:00:00.000Z",
    "validFrom": "2025-04-06T15:00:00.000Z",
    "credentialSubject": {
      "id": "0a7f3452-d5cd-4a6a-9876-2e4f74db3dfb",
      "verifiedIdentities": [
        {
          "type": "cawg.social_media",
          "name": "OriginVault User",
          "address": "demo@originvault.me",
          "verifiedAt": "2025-04-06T14:59:00.000Z",
          "provider": {
            "id": "google",
            "name": "Google",
            "type": "OAuthProvider"
          },
          "username": "demo",
          "method": "OAuth"
        },
        {
          "type": "cawg.crypto_wallet",
          "name": "OriginVault User DID:Key",
          "address": "did:key:z6MksXkCb123abc456",
          "uri": "did:key:z6MksXkCb123abc456",
          "verifiedAt": "2025-04-06T14:59:10.000Z",
          "provider": {
            "id": "originvault",
            "name": "OriginVault",
            "type": "OAuthProvider"
          },
          "method": "OAuth"
        },
        {
          "type": "cawg.crypto_wallet",
          "name": "OriginVault Wallet",
          "address": "0xFAKE0x1234abcdef",
          "verifiedAt": "2025-04-06T14:59:20.000Z",
          "provider": {
            "id": "originvault",
            "name": "OriginVault",
            "type": "OAuthProvider"
          },
          "method": "OAuth"
        },
        {
          "type": "cawg.document_verification",
          "name": "Government ID",
          "address": "demo@originvault.me",
          "verifiedAt": "2025-04-06T14:59:30.000Z",
          "provider": {
            "id": "stripe",
            "name": "Stripe",
            "type": "IdentityProvider"
          },
          "method": "Biometric"
        }
      ],
      "registeredContent": [
        {
          "id": "did:cheqd:mainnet:123456789abcdef/resources/da515579a5b87671f8c4e0842383f9a1af2b022d8378a4e677e9d54d147fa1a3",
          "contentHash": "da515579a5b87671f8c4e0842383f9a1af2b022d8378a4e677e9d54d147fa1a3",
          "fileName": "QmPCMvwsnpZWkReAoHnh4xXWPA6xMEJFufrWmE3gjQfFpk.png",
          "username": "demo",
          "publicPath": "https://demo.originvault.me/embeddable/wear-pepper-wheel-birth-barely",
          "color": "#000000",
          "colorCode": "fd1628-384919-67fd9e-3f78b9-488968-b4274e-b139b9-8e973e-eb887b-de33fe-587c36-a2fdb7-1167f0-c15cd0-d7ce49-828ff4-3684c5-700ef0-65a3f5-dfa139-3d262d-841b98-08ffe7-263795",
          "createdAt": "2025-04-06T14:59:18.274Z",
          "status": "pending",
          "mnemonicId": "wage-spoon-flower-birth-barely",
          "perceptualHashes": {
            "soft": "c33ce1c3a3c3e781",
            "medium": "f80fe1c3cff11c20be21bc07b80fb80f181ddc19e633f80ff813ffffc003c003",
            "precise": "ff003ff8000ff07f07e1dec387f7e3078080dff3b9dfc0019f804d80001fdf803dde417d070079cf80f1e780f3f1c9c7f8430ffe003fff006ffff7fff6dfffe00003e00003e40003"
          }
        }
      ]
    }
  },
  "proof": {
    "type": "JwtProof2020",
    "jwt": "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1cm46dXVpZDo..."
  }
}


export async function createUserContentRegistration(parentAgent, signingDid, provider, privateKeyStore) {
  const resourceId = uuidv4();
  const hashedRecordId = crypto.createHash('sha256').update('registrationRecord' + 'REGISTRATION_SALT').digest('hex');
  const resourceName = `content-registration-${hashedRecordId}`.substring(0, 64);
  const result = await createResource({
        data: registrationRecord,
        did: signingDid,
        name: resourceName,
        provider: provider,
        agent: parentAgent,
        keyStore: privateKeyStore,
        resourceId: resourceId,
        resourceType: 'Content-Registration-Record',
        version: Math.floor(Date.now() / 1000)
    });

  return result;
}

(async () => {
    try {
        const { agent, cheqdMainnetProvider, did, privateKeyStore } = await parentStore.initialize();
        console.log(agent, cheqdMainnetProvider, did, privateKeyStore);
        const result = await createUserContentRegistration(agent, did, cheqdMainnetProvider, privateKeyStore);
        console.log(`✅ Content registration created successfully: ${JSON.stringify(result)}`);
    } catch (error) {
        console.error("❌ Error signing release metadata:", error);
        process.exit(1);
    }
})(); 