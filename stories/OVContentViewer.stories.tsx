import React, { useState } from "react";
import { Meta, StoryFn } from "@storybook/react";
import { OVContentViewer, OVContentViewerProps } from "../src/index";

export default {
  title: "OVContentViewer",
  component: OVContentViewer,
} as Meta<typeof OVContentViewer>;

const Template: StoryFn<OVContentViewerProps> = (args) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  return (
    <OVContentViewer isFullScreen={isFullScreen} setIsFullScreen={setIsFullScreen} {...args}  />
  );
};

export const Default = Template.bind({});
Default.args = {
  did: "did:cheqd:mainnet:dd7b35bd-d528-5add-9447-bcef7f47276b",
  title: "@originvault/ov-content-viewer",
  resourceTypes: [
    "Content-Registration-Record", 
  ],
  isEmbedded: false,
  isHoverable: true,
  isDarkMode: false,
  isMobile: false,
  hideOriginInfoIcon: false,
  src: "../viewable.jpg",
  type: "image/png",
}; 