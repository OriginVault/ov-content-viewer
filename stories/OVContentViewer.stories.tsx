import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { OVContentViewer, OVContentViewerProps } from "../src/index";

export default {
  title: "OVContentViewer",
  component: OVContentViewer,
} as Meta<typeof OVContentViewer>;

const Template: StoryFn<OVContentViewerProps> = (args) => <OVContentViewer {...args} />;

export const Default = Template.bind({});
Default.args = {
  did: "did:cheqd:mainnet:280dd37c-aa96-5e71-8548-5125505a968e",
  title: "@originvault/ov-id-sdk",
  resourceTypes: [
    "Content", 
  ],
  isFullScreen: false,
  isEmbedded: false,
  isHoverable: true,
  isDarkMode: true,
  hideOriginInfoIcon: false,
  setIsFullScreen: () => {},
  src: "../viewable.jpg",
  type: "image/png",
}; 