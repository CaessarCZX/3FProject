import "@rainbow-me/rainbowkit/styles.css";
import { BlockchainAppWithProviders } from "~~/components/Providers/BlockchainAppWhitProviders";
import { ThemeProvider } from "~~/components/Providers/ThemeProvider";
import "~~/styles/globals.css";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Friends & Family Funds",
  description: "Wellcome to colective fund",
});

const MainApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning>
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
