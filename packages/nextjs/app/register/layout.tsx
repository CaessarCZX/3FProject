import "@rainbow-me/rainbowkit/styles.css";
import { BlockchainAppWithProviders } from "~~/components/Providers/BlockchainAppWhitProviders";
import { ThemeProvider } from "~~/components/Providers/ThemeProvider";
import "~~/styles/globals.css";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Register",
  description: "Welcome to the family",
});

const RegisterLayaout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="Es" suppressHydrationWarning>
      <body>
        <ThemeProvider enableSystem>
          <BlockchainAppWithProviders>{children}</BlockchainAppWithProviders>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RegisterLayaout;
