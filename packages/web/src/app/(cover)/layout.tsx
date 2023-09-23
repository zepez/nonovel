export const metadata = {
  title: "NoNovel | Cover Generation",
  description: "Only authorized access is allowed",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
