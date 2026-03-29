import './globals.css';

export const metadata = {
  title: 'YouTube Watch Party',
  description: 'Watch YouTube videos together in real-time',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}