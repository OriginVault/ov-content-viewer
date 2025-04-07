import React, { useState } from 'react';
import { Box, Typography, IconButton, Tooltip, Popper } from '@mui/material';
import { Check, CopyAllOutlined, InfoOutlined } from '@mui/icons-material';


const ColorFragment = ({ color }: { color: string }) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handleMouseEnter = (event: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMouseLeave = () => {
    setAnchorEl(null);
  };

  return (
    <Box key={color}>
      <Box 
        title={color}
        component="div"
        sx={{
          backgroundColor: color,
          height: '20px',
          width: '20px',
          cursor: 'pointer',
          '&:hover': {
            outline: '1px solid #333',
          }
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleMouseEnter}
        onTouchEnd={handleMouseLeave}
      />
      <Popper open={Boolean(anchorEl)} anchorEl={anchorEl} placement="bottom" style={{ maxWidth: '200px', position: 'relative', zIndex: 1002 }}>
        <Box sx={{ backgroundColor: color, height: '50px', width: '50px', cursor: 'pointer' }} />
        <Typography variant="caption" color="textSecondary" mt={1} display="block">
          {color}
        </Typography>
      </Popper>
    </Box>
  );
};

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

const ColorBarcode = ({ contentHash, color, colorCode, isDarkMode }) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', maxWidth: '650px' }}>
            <Typography variant="subtitle2" align="center" gutterBottom style={{ color: isDarkMode ? '#add4ef' : '#1c2a35' }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: '2px', padding: '6px', border: '1px solid #ccc', borderRadius: '4px' }}>
                <Box 
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '2px',
                        padding: '6px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        backgroundColor: color,
                        '&:hover': {
                            backgroundColor: '#f9f9f9',
                        }
                    }}
                >
                    {colorCode.split('-').map((color) => (
                        <ColorFragment key={color} color={`#${color}`} />
                    ))}
                </Box>
               
            </Box>
            </Typography>
        </Box>
    );
};

export default ColorBarcode;