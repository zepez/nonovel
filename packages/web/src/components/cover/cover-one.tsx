import Balancer from "react-wrap-balancer";
import { Watermark } from "~/components/cover/watermark";

interface Props {
  background: string;
  name: string;
  penName: string;
}

export const CoverOne = ({ background, name, penName }: Props) => {
  return (
    <>
      <div className="relative flex h-[900px] w-[600px] items-center justify-center text-center text-nn-base-dark">
        <img
          src={`data:image/jpeg;base64,${background}`}
          className="cover-simple-border-inset absolute inset-0 h-full w-full object-cover"
        />

        <div className="cover-simple-border cover-simple-border-inset z-10 w-[475px] bg-nn-base-light px-4 py-12">
          <h1 className="mb-4 font-display text-5xl font-bold italic leading-snug">
            <Balancer>{name}</Balancer>
          </h1>
          <h2 className="m-0 font-display text-3xl">
            <Balancer>{penName}</Balancer>
          </h2>
        </div>

        <Watermark className="absolute bottom-10 left-0" />
      </div>
    </>
  );
};
