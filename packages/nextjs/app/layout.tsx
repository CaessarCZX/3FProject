import "@rainbow-me/rainbowkit/styles.css";
import { BlockchainAppWithProviders } from "~~/components/Providers/BlockchainAppWhitProviders";
import { ThemeProvider } from "~~/components/Providers/ThemeProvider";
import "~~/styles/globals.css";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Bienvenido a FREE!",
  description: "Wellcome to the family",
});

const MainApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="Es" suppressHydrationWarning>
      {/* Provisional meta tag for http request */}
      <head>
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
      </head>
      {/* Provisional meta tag for http request */}
      <body>
        <ThemeProvider enableSystem>
          <BlockchainAppWithProviders>{children}</BlockchainAppWithProviders>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default MainApp;
// export default ScaffoldEthApp;
