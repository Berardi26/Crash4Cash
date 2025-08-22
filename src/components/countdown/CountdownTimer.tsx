'use client'
import { CircularProgress, Card, CardBody, CardFooter, Chip, Image } from "@heroui/react";
import { useEffect, useState } from "react";

export default function Countdown(props: { time: number }) {
  const { time } = props;
  const [value, setValue] = useState(time);

  useEffect(() => {
    if (time <= 0) return;

    const interval = setInterval(() => {
      setValue((v) => {
        if (v <= 0) {
          clearInterval(interval);
          return 0;
        }
        return v - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [time]);

  // Percentage for CircularProgress
  const percentage = (value / time) * 100;

  // Format time as mm:ss
  const minutes = Math.floor(value / 60);
  const seconds = value % 60;
  const timeLabel = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  return (
    <Card className="w-full h-[240px] border-none ">
      <CardBody className="justify-center items-center pb-0">
        {value > 0 ? <CircularProgress
          classNames={{
            svg: "w-40 h-40 drop-shadow-md",
            indicator: "stroke-white",
            track: "stroke-white/10",
            value: "text-xl font-semibold text-white",
          }}
          showValueLabel={true}
          value={percentage}
          valueLabel={timeLabel} // show formatted countdown
          strokeWidth={4}
        />
          :
          <div className="w-40 h-40 [perspective:600px]">
            <Image src="/assets/images/coin.png" alt="Coin" className="w-full h-full animate-flip-coin [transform-style:preserve-3d]" />
          </div>
        }
      </CardBody>
      <CardFooter className="justify-center items-center pt-0">
        {value > 0 && <Chip
          classNames={{
            base: "border-1 border-white/30",
            content: "text-white/90 text-small font-semibold",
          }}
          variant="bordered"
        >
          {`Rocket will Launch in ${value} seconds`}
        </Chip>}
      </CardFooter>
    </Card>
  );
}
