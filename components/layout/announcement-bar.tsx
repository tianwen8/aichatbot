import Link from "next/link";

export default function AnnouncementBar() {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white py-2 px-4 text-center">
      <p className="text-sm font-medium">
        Discover the best AI character chat platforms of 2025{" "}
        <Link href="/trending" className="underline hover:text-white/90 font-semibold">
          Learn more →
        </Link>
      </p>
    </div>
  );
} 