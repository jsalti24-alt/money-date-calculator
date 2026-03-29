import './globals.css';

export const metadata = {
  title: "The Money Date — What's Your Habit Really Costing You?",
  description: "See the 40-year compound impact of your everyday spending. Run the numbers with your partner. The conversation changes everything.",
  openGraph: {
    title: "The Money Date — Compound Interest Calculator",
    description: "Your $35/week DoorDash habit could be worth $1.2M. See what your habits are really costing you.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Money Date — What's Your Habit Really Costing You?",
    description: "Your $35/week DoorDash habit could be worth $1.2M. See what your habits are really costing you.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
