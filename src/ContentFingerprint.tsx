import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { PartialFingerprint, StandardFingerprint, FullFingerprint } from './fingerprints';

function djb2(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i); /* hash * 33 + c */
  }
  return hash;
}

function hashStringToColor(str: string): string {
  const hash = djb2(str);
  const r = (hash >> 16) & 0xFF;
  const g = (hash >> 8) & 0xFF;
  const b = hash & 0xFF;
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

const getTextColorBasedOnBackground = (bgColor: string): string => {
  // Convert hex color to RGB
  const hex = bgColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Calculate brightness
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  // Return black or white text based on brightness
  return brightness > 128 ? '#000000' : '#FFFFFF';
};

const Fingerprint = ({ type, hash, FingerprintComponent }: { type: string, hash: string, FingerprintComponent: React.ComponentType<{ color: string, style: any }> }) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const color = hashStringToColor(hash);
  return (
    <Box
      title={`shaHash: ${hash}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleMouseEnter}
      onTouchEnd={handleMouseLeave}
      sx={{
        position: 'relative',
        backgroundColor: isHovered ? getTextColorBasedOnBackground(color) : color,
        color: isHovered ? color : getTextColorBasedOnBackground(color),
        height: 25,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        fontSize: 24,
        cursor: 'pointer',
        flexDirection: 'row',
        padding: '18px',
        borderRadius: '10px',
        gap: '10px',
        width: '150px',
      }}
      onClick={() => {
        window.open(`https://www.color-hex.com/color/${color.replace('#', '')}`, '_blank');
      }}
    >
        <Typography 
          sx={{ 
            backgroundColor: isHovered ? color : 'rgba(255, 255, 255, 0.7)', 
            borderRadius: '5px', 
            padding: '2px 5px',
            color: isHovered ? getTextColorBasedOnBackground(color) : '#1c2a35',
            fontSize: '10px',
          }}
        >
          {type}:
        </Typography>
        <FingerprintComponent style={{ transform: 'rotate(-45deg)', height: '25px', width: '25px' }} color={isHovered ? color : getTextColorBasedOnBackground(color)} />
        <Typography fontSize='12px'>{color}</Typography>
    </Box>
  );
};

const ContentFingerprints = ({ softPerceptualHash, mediumPerceptualHash, precisePerceptualHash }: { softPerceptualHash: string, mediumPerceptualHash: string, precisePerceptualHash: string }) => {
  const fingerprintComponents = {
    [softPerceptualHash]: PartialFingerprint,
    [mediumPerceptualHash]: StandardFingerprint,
    [precisePerceptualHash]: FullFingerprint,
  };

  const getFingerprintComponent = (hash: string) => {
    return fingerprintComponents[hash];
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'flex-start', 
      alignItems: 'flex-start',
      width: '100%'
    }}>
      <Box
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'space-between',
          alignItems: 'flex-start', 
          flexWrap: 'wrap', 
          gap: '10px', 
          width: '100%',
          padding: '10px',
        }}
      >
        <Fingerprint type='soft' hash={softPerceptualHash} FingerprintComponent={getFingerprintComponent(softPerceptualHash)} />
        <Fingerprint type='medium' hash={mediumPerceptualHash} FingerprintComponent={getFingerprintComponent(mediumPerceptualHash)} />
        <Fingerprint type='precise' hash={precisePerceptualHash} FingerprintComponent={getFingerprintComponent(precisePerceptualHash)} />
      </Box>
    </Box>
  );
};

export default ContentFingerprints; 