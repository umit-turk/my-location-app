// app/layout.tsx
import { Providers } from './providers/providers'
import Header from './ui/Header/Header'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  return (
    <html lang='en'>
      <body>
        <Providers>
          <Header />
          {children}
          </Providers>
      </body>
    </html>
  )
}