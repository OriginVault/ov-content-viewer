import React, { useEffect, useState } from "react";
import { Box, CircularProgress, IconButton, Popover } from "@mui/material"
import { Close, OpenInFull } from "@mui/icons-material"
import { OVIdViewer } from "@originvault/ov-id-viewer";

interface OVContentViewerProps {
  did: string;
  size?: "sm" | "md" | "lg";
  title?: string;
  render?: (data: any) => React.ReactNode;
  renderProps?: {
    title?: string;
    onClose: () => void;
    validatedAt: Date | null;
  };
  resourceTypes?: string[];
  resourceRenderer?: (resource: any) => React.ReactNode;
  isFullScreen?: boolean;
  setIsFullScreen?: (isFullScreen: boolean) => void;
  isEmbedded?: boolean;
  isHoverable?: boolean;
  hideOriginInfoIcon: boolean;
  src: string;
  type: string;
  alt: string;
  isDarkMode: boolean;
  embeddedBackgroundColor?: string;
  isMobile?: boolean;
}

const OVContentViewer = ({ isDarkMode, did, src, size = "md", title, render, renderProps, resourceTypes, resourceRenderer, isFullScreen = false, setIsFullScreen, isEmbedded = false, isHoverable = true, hideOriginInfoIcon = false, type = "image/png", alt = "Content", embeddedBackgroundColor, isMobile = false }: OVContentViewerProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [data, setData] = useState<any>(null);
  const [validatedAt, setValidatedAt] = useState<Date | null>(null);

  const handleClick = async (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    const url = `https://resolver.cheqd.net/1.0/identifiers/${did}`;
    try {
      const response = await fetch(url);
      setValidatedAt(new Date());
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error(error);
      setData(null);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    if (isHoverable) {
      setIsHovering(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const handleFullScreenToggle = () => {
    if (setIsFullScreen) {
      setIsFullScreen(!isFullScreen);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isFullScreen && !isEmbedded) {
        if (event.key === "Escape") {
          handleFullScreenToggle();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFullScreen]);

  const hideInfoIcon = hideOriginInfoIcon || !did;

  const embeddedBGColor = embeddedBackgroundColor  || (isDarkMode ? "black" : "white");

  return (
    <Box 
      sx={{ 
        position: isFullScreen ? "fixed" : "relative", 
        top: 0,
        left: 0,
        zIndex: isFullScreen ? 1000 : 0,
        width: "100%",
        height: "100%",
        padding: isEmbedded || isFullScreen ? "0" : "16px",
        backgroundColor: isEmbedded ? embeddedBGColor : "transparent",
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "center", 
      }}
    >
       {isFullScreen && (
        <Box 
          onClick={handleFullScreenToggle}
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: isDarkMode ? "rgba(0, 0, 0, 0.7)" : "rgba(255, 255, 255, 0.7)",
            zIndex: 999,
          }}
        />
      )}
      <Box sx={{ 
        width: "fit-content", 
        height: "fit-content",
        position: "relative"
      }}>
        <img 
          src={src} 
          alt={alt} 
          onMouseEnter={handleMouseEnter} 
          onMouseLeave={handleMouseLeave}
          style={{ height: isMobile ? "90%" : "90vh", objectFit: "contain", position: "relative", zIndex: isFullScreen ? 1000 : 0}}
        />   
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            zIndex: isFullScreen ? 1000 : 0,
          }}
        >
          <IconButton
            aria-describedby={id}
            onClick={handleFullScreenToggle}
            sx={{
              opacity: isHoverable && isHovering || isMobile ? 0.1 : 0,
              transition: "opacity 0.3s ease",
              '&:hover': {
                opacity: isHoverable ? 1 : 0,
              },
            }}
          >
            {isFullScreen ? <Close sx={{ color: isDarkMode ? "#f2d087" : "#000000" }} /> : <OpenInFull sx={{ color: isDarkMode ? "#f2d087" : "#000000" }} />}
          </IconButton>
        </Box>
        {!hideInfoIcon && <Box
          sx={{
            position: "absolute",
            bottom: 4,
            right: 0,
            zIndex: isFullScreen ? 1000 : 0,
          }}
        >
          <IconButton
            aria-describedby={id}
            onClick={handleClick}
            sx={{
              opacity: isHoverable && isHovering || isMobile ? 0.1 : 0,
              transition: "opacity 0.3s ease",
              '&:hover': {
                opacity: isHoverable ? 1 : 0,
              },
            }}
          >
            {open && data === null ? 
              <CircularProgress size={size === "sm" ? 24 : size === "md" ? 36 : 48} style={{ color: '#f2d087' }}/>
            : (
              <OVIdViewer did={did} title={title} />
            )}
            
          </IconButton>
        </Box>}
      </Box>
    </Box>
  );
};

export { OVContentViewer, type OVContentViewerProps };



