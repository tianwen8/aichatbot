import GoogleAnalytics from '../components/GoogleAnalytics';

export const metadata = {
  title: 'Travel China Space',
  description: 'Discover amazing places in China'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
} 