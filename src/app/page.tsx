import Image from "next/image";
import Link from "next/link";
import Layout from "@/components/layout/layout";

const games = [
  {
    name: "Jackpot",
    icon: null, // Placeholder, can be replaced with an image
    emoji: "🎰",
    href: "/jackpot",
    bg: "from-yellow-400 to-pink-500"
  },
  {
    name: "Coinflip",
    icon: "/assets/game/image/token.png",
    emoji: null,
    href: "/coinflip",
    bg: "from-yellow-300 to-yellow-600"
  },
  {
    name: "Rocket",
    icon: "/assets/images/icons/rocket.png",
    emoji: null,
    href: "/crash",
    bg: "from-blue-400 to-purple-600"
  },
];

export default function Home() {
  return (
    <Layout className="bg-gradient-to-br from-black via-gray-900 to-gray-800">
      <div className="flex flex-col items-center justify-center min-h-[70vh] py-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-12 drop-shadow-lg uppercase tracking-widest">
          Choose Your Game
        </h1>
        <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
          {games.map((game) => (
            <Link
              key={game.name}
              href={game.href}
              className={`group flex flex-col items-center justify-center w-56 h-56 md:w-64 md:h-64 rounded-3xl shadow-xl bg-gradient-to-br ${game.bg} hover:scale-105 transition-transform duration-200 cursor-pointer border-4 border-white/10 hover:border-primary-400`}
              prefetch={false}
            >
              <div className="flex items-center justify-center w-24 h-24 md:w-32 md:h-32 bg-black/30 rounded-full mb-6 shadow-inner">
                {game.icon ? (
                  <Image
                    src={game.icon}
                    alt={game.name + " icon"}
                    width={96}
                    height={96}
                    className="object-contain drop-shadow-lg"
                    priority
                  />
                ) : (
                  <span className="text-7xl md:text-8xl drop-shadow-lg select-none">
                    {game.emoji}
                  </span>
                )}
              </div>
              <span className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg uppercase tracking-wide">
                {game.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
