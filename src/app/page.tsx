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
        <div className="flex md:flex-col gap-6 w-[210px] xs:w-[430px] lg:w-[210px] h-fit flex-wrap m-auto md:m-0 shrink-0">
          <div className="flex flex-col xs:mx-auto xs:flex-row lg:flex-col gap-6 w-full zoom-80 2xl:zoom-100">
            <div className="relative h-full w-full" style={{ animationDelay: "0s" }}>
              <div className="backface-hidden preserve-3d" style={{ transform: "translateZ(-5px)" }}>
                <div className="flex w-full bg-layer2 rounded-[10px] p-[2px] border border-[#2E3E5A]">
                  <div className="flex bg-gradient-border p-[1px] w-full h-full rounded-[10px]">
                    <div className="flex flex-col w-full h-full bg-gradient-color gap-4 rounded-[10px]">
                      <div className="flex flex-col w-full h-full rounded-t-[10px] relative gap-3">
                        <img src="/images/download.webp" className="object-cover object-center w-full rounded-t-[10px] absolute top-0 left-0" alt=""></img>
                        <div className="rounded-t-[10px] px-3 py-[6px] z-[3]">
                          <div className="flex justify-between uppercase text-xs text-light-grey">
                            <p>Round</p>
                            {/* <p>#{latestWinner.round}</p> */}
                          </div>
                        </div>
                        <div className="flex items-center justify-center w-full drop-shadow-small">
                          <div className="flex items-center justify-center bg-secondary z-[300] w-[72px] h-[72px] rounded-[10px] p-[1.5px]">
                            <div className="flex w-full h-full rounded-[10px] border border-[#03036D]">
                              {/* <img src={latestWinner.user_id.avatar} className="object-cover object-center rounded-[10px] w-full h-full" alt=""></img> */}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          {/* <p className="font-inter text-sm font-semibold max-w-[75px] truncate text-white text-center">{latestWinner.user_id.username}</p> */}
                          <img src="/images/winner.svg" className="object-cover object-center w-full px-10" alt=""></img>
                        </div>
                      </div>
                      <div className="w-full bg-layer2 rounded-b-[10px] relative py-2 px-3">
                        <img src="/images/static/grid.bb6dda07.webp" className="object-cover object-center w-full h-full rounded-b-[10px] absolute top-0 left-0" alt=""></img>
                        <div className="flex flex-col gap-[2px]">
                          <div className="flex items-center w-full justify-between z-[3]">
                            <p className="font-inter text-xs text-light-grey">Won</p>
                            <div className="flex items-center gap-1.5">
                              <img src="/images/solana.png" alt="" className="w-3 h-3" />
                              {/* <p className="font-inter text-sm font-semibold text-white">{latestWinner.won.toFixed(4)}</p> */}
                            </div>
                          </div>
                          <div className="flex items-center w-full justify-between z-[3]">
                            <p className="font-inter text-xs text-light-grey">Chance</p>
                            {/* <p className="font-inter text-sm font-semibold text-white">{Number(latestWinner.chance).toFixed(2)}%</p> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative overf h-full w-full" style={{ animationDelay: "0s" }}>
              <div className="backface-hidden preserve-3d" style={{ transform: "translateZ(-5px)" }}>
                <div className="flex w-full bg-layer2 rounded-[10px] p-[2px] border border-[#2E3E5A]">
                  <div className="flex bg-gradient-border p-[1px] w-full h-full rounded-[10px]">
                    <div className="flex flex-col w-full h-full bg-gradient-color gap-4 rounded-[10px]">
                      <div className="flex flex-col w-full h-full rounded-t-[10px] relative gap-3">
                        <img src="/images/download.webp" className="object-cover object-center w-full rounded-t-[10px] absolute top-0 left-0" alt=""></img>
                        <div className="rounded-t-[10px] px-3 py-[6px] z-[3]">
                          <div className="flex justify-between uppercase text-xs text-light-grey">
                            <p>Round</p>
                            {/* <p>#{luckyUser.round}</p> */}
                          </div>
                        </div>
                        <div className="flex items-center justify-center w-full drop-shadow-small">
                          <div className="flex items-center justify-center bg-[#FEAE38] z-[300] w-[72px] h-[72px] rounded-[10px] p-[1.5px]">
                            <div className="flex w-full h-full rounded-[10px] border border-[#03036D]">
                              {/* <img src={luckyUser.user_id.avatar} className="object-cover object-center rounded-[10px] w-full h-full" alt=""></img> */}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          {/* <p className="font-inter text-sm font-semibold max-w-[75px] truncate text-white text-center">{luckyUser.user_id.username}</p> */}
                          <img src="/images/luck.svg" className="object-cover object-center w-full px-10" alt=""></img>
                        </div>
                      </div>
                      <div className="w-full bg-layer2 rounded-b-[10px] relative py-2 px-3">
                        <img src="/images/static/grid.bb6dda07.webp" className="object-cover object-center w-full h-full rounded-b-[10px] absolute top-0 left-0" alt=""></img>
                        <div className="flex flex-col gap-[2px]">
                          <div className="flex items-center w-full justify-between z-[3]">
                            <p className="font-inter text-xs text-light-grey">Won</p>
                            <div className="flex items-center gap-1.5">
                              <img src="/images/solana.png" alt="" className="w-3 h-3" />
                              {/* <p className="font-inter text-sm font-semibold text-white">{luckyUser.won.toFixed(4)}</p> */}
                            </div>
                          </div>
                          <div className="flex items-center w-full justify-between z-[3]">
                            <p className="font-inter text-xs text-light-grey">Chance</p>
                            {/* <p className="font-inter text-sm font-semibold text-white">{Number(luckyUser.chance).toFixed(2)}%</p> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
