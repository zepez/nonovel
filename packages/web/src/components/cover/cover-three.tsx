import Balancer from "react-wrap-balancer";
import { Watermark } from "~/components/cover/watermark";

interface Props {
  background: string;
  name: string;
  penName: string;
}

export const CoverThree = ({ background, name, penName }: Props) => {
  return (
    <>
      <div className="relative flex h-[900px] w-[600px] flex-col items-center justify-end pb-16 text-center font-bold text-nn-dark">
        <img
          src={`data:image/jpeg;base64,${background}`}
          className="cover-simple-border-inset absolute inset-0 h-full w-full object-cover"
        />

        <div className="cover-svg-overlay-two relative z-10 w-[475px] rounded-md px-4 py-12">
          <h1 className="mb-4 font-serif text-5xl italic leading-snug">
            <Balancer>{name}</Balancer>
          </h1>
          <h2 className="m-0 font-serif text-3xl font-thin">
            <Balancer>{penName}</Balancer>
          </h2>
        </div>

        <Watermark className="absolute left-0 top-10" />
      </div>
    </>
  );
};
