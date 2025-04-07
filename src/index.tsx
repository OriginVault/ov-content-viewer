import React, { useEffect, useState } from "react";
import {
  Box,
  IconButton,
} from "@mui/material";
import { Close, OpenInFull, OpenInNew } from "@mui/icons-material";
import { OVIdViewer } from "@originvault/ov-id-viewer";
import { renderDIDDetails } from "./renderDIDDetails";
import './App.css';

interface OVContentViewerProps {
  did: string;
  size?: "sm" | "md" | "lg";
  title?: string;
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
  height?: string;
  width?: string;
  showByDefault?: boolean;
  iconSize?: "sm" | "md" | "lg";
}

const OVContentViewer = ({
  isDarkMode,
  did,
  src,
  iconSize = "md",
  title,
  renderProps,
  resourceTypes,
  resourceRenderer,
  isFullScreen = false,
  setIsFullScreen,
  isEmbedded = false,
  isHoverable = true,
  hideOriginInfoIcon = false,
  type = "image/png",
  alt = "Content",
  embeddedBackgroundColor,
  isMobile = false,
  height = "fit-content",
  width = "fit-content",
  showByDefault = false
}: OVContentViewerProps) => {
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseEnter = () => isHoverable && setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);
  const handleFullScreenToggle = () => setIsFullScreen?.(!isFullScreen);

  useEffect(() => {
    const onEsc = (event: KeyboardEvent) => {
      if (isFullScreen && !isEmbedded && event.key === "Escape") {
        handleFullScreenToggle();
      }
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [isFullScreen]);

  const embeddedBGColor = embeddedBackgroundColor || "transparent";
  const bgColor = isDarkMode ? "rgba(0, 0, 0, 0.7)" : "rgba(255, 255, 255, 0.7)";
  const styles = {
    position: isFullScreen ? "fixed" : "relative",
    top: 0,
    left: 0,
    zIndex: isFullScreen ? 1000 : 0,
    width: isFullScreen ? "100%" : width,
    height: isFullScreen ? "100%" : height,
    maxHeight: isFullScreen ? "100vh" : height,
    maxWidth: isFullScreen ? "100vw" : width,
    padding: isEmbedded || isFullScreen ? "0" : "16px",
    backgroundColor: isEmbedded ? embeddedBGColor : bgColor,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    objectFit: "contain"
  };

  return (
    <Box sx={styles}>
      {isFullScreen && (
        <Box
          onClick={handleFullScreenToggle}
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: isEmbedded ? embeddedBGColor : 'transparent',
            zIndex: 999,
          }}
        />
      )}
      <Box sx={{
        width,
        height,
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <img
          src={src}
          alt={alt}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            maxWidth: isFullScreen ? "100vw" : width,
            maxHeight: isFullScreen ? "100vh" : height,
            height: "auto",
            objectFit: "contain",
            position: "relative",
            zIndex: isFullScreen ? 1000 : 0
          }}
        />
        <Box sx={{
          position: isFullScreen ? "fixed" : "absolute",
          top: 0,
          right: 0,
          zIndex: isFullScreen ? 1000 : 0,
        }}>
          {isEmbedded ? (
            <IconButton
              onClick={() => window.open(src, "_blank")}
              sx={{
                opacity: isHoverable && (isHovering || isMobile) ? 0.1 : 0,
                transition: "opacity 0.3s ease",
                '&:hover': { opacity: isHoverable ? 1 : 0 }
              }}
            >
              <OpenInNew sx={{ color: isDarkMode ? "#f2d087" : "#000" }} />
            </IconButton>
          ) : (
            <IconButton
              onClick={handleFullScreenToggle}
              sx={{
                opacity: isHoverable && (isHovering || isMobile) ? 0.1 : 0,
                transition: "opacity 0.3s ease",
                '&:hover': { opacity: isHoverable ? 1 : 0 }
              }}
            >
              {isFullScreen
                ? <Close sx={{ color: isDarkMode ? "#f2d087" : "#000" }} />
                : <OpenInFull sx={{ color: isDarkMode ? "#f2d087" : "#000" }} />}
            </IconButton>
          )}
        </Box>
        {!hideOriginInfoIcon && (
          <Box
            sx={{
              position: isFullScreen ? "fixed" : "absolute",
              bottom: 4,
              right: 0,
              zIndex: isFullScreen ? 1000 : 0,
            }}
          >
            <OVIdViewer
              did={did}
              title={title}
              render={renderDIDDetails}
              renderProps={{...renderProps, isDarkMode }}
              resourceTypes={resourceTypes}
              resourceRenderer={resourceRenderer}
              isHoverable={isHoverable}
              showByDefault={showByDefault}
              size={iconSize}
              isHovering={isHovering}
              isMobile={isMobile}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export { OVContentViewer, type OVContentViewerProps };
