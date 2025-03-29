<div style="width: 100%; display: flex; justify-content: center; align-items: center;">
      <img src="https://gray-objective-tiglon-784.mypinata.cloud/ipfs/Qma7EjPPPfomzEKkYcJa2ctEFPUhHaMwiojTR1wTQPg2x8" alt="OriginVault logo" width="300" height="300">
</div>
<br />

# @originvault/ov-content-viewer🪟

OVContentViewer is a React component designed to display content in a versatile viewer. It supports full-screen mode, hover effects, and customizable rendering of resources. This component is particularly useful for displaying images and other media types in a user-friendly interface.

## Features

- Full-screen toggle functionality
- Hoverable icons for additional actions
- Customizable rendering of content
- Support for dark mode
- Responsive design for mobile devices

## Installation

To use the OVContentViewer component in your project, follow these steps:

1. **Install Dependencies**: Make sure you have React and Material-UI installed in your project. If you haven't installed them yet, you can do so using npm or yarn:

   ```bash
   npm install @mui/material @mui/icons-material
   ```

   or

   ```bash
   yarn add @mui/material @mui/icons-material
   ```

2. **Add the Component**: Import the `OVContentViewer` component into your desired file:

   ```typescript
   import { OVContentViewer } from '@originvault/ov-content-viewer';
   ```

## Usage

Here’s a basic example of how to use the `OVContentViewer` component:

````typescript
import React from 'react';
import { OVContentViewer } from '@originvault/ov-content-viewer';

const App = () => {
  return (
    <OVContentViewer
      did="your-did-here"
      src="your-image-url-here"
      title="Your Title"
      isDarkMode={false}
      hideOriginInfoIcon={false}
      type="image/png"
      alt="Description of the content"
      isFullScreen={false}
      setIsFullScreen={(isFullScreen) => console.log(isFullScreen)}
    />
  );
};

export default App;
````

## Props

The `OVContentViewer` component accepts the following props:

| Prop                     | Type                          | Description                                                                 |
|--------------------------|-------------------------------|-----------------------------------------------------------------------------|
| `did`                    | `string`                      | The decentralized identifier for the content.                             |
| `size`                   | `"sm" | "md" | "lg"`         | The size of the content viewer. Default is "md".                          |
| `title`                  | `string`                      | The title of the content viewer.                                           |
| `render`                 | `(data: any) => React.ReactNode` | Custom render function for the content.                                   |
| `renderProps`            | `{ title?: string; onClose: () => void; validatedAt: Date | null; }` | Props for the custom render function.                                     |
| `resourceTypes`          | `string[]`                   | Array of resource types to be rendered.                                   |
| `resourceRenderer`       | `(resource: any) => React.ReactNode` | Custom renderer for resources.                                            |
| `isFullScreen`           | `boolean`                     | Indicates if the viewer is in full-screen mode.                           |
| `setIsFullScreen`        | `(isFullScreen: boolean) => void` | Function to toggle full-screen mode.                                      |
| `isEmbedded`             | `boolean`                     | Indicates if the viewer is embedded.                                      |
| `isHoverable`            | `boolean`                     | Indicates if hover effects are enabled.                                   |
| `hideOriginInfoIcon`     | `boolean`                     | Hides the origin info icon if true.                                       |
| `src`                    | `string`                      | The source URL of the content to be displayed.                            |
| `type`                   | `string`                      | The MIME type of the content. Default is "image/png".                    |
| `alt`                    | `string`                      | Alternative text for the content.                                         |
| `isDarkMode`             | `boolean`                     | Indicates if dark mode is enabled.                                        |
| `embeddedBackgroundColor` | `string`                      | Background color for embedded mode.                                       |
| `isMobile`               | `boolean`                     | Indicates if the viewer is being used on a mobile device.                 |

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## Acknowledgments

- [React](https://reactjs.org/)
- [Material-UI](https://mui.com/)
