import Balancer from "react-wrap-balancer";
import { Watermark } from "~/components/cover/watermark";

interface Props {
  background: string;
  name: string;
  penName: string;
}

export const CoverTwo = ({ background, name, penName }: Props) => {
  return (
    <>
      <div className="h-[900px] w-[600px] text-center font-bold text-nn-dark">
        <div className="cover-svg-overlay-one relative h-full w-full">
          <img
            src={`data:image/jpeg;base64,${background}`}
            className="h-full w-full object-cover"
          />

          <div className="absolute left-0 top-0 w-full">
            <div className="cover-simple-border cover-simple-border-inset mx-auto mt-32 w-[475px] bg-nn-light px-4 py-8">
              <h1 className="mb-4 font-serif text-5xl italic leading-snug">
                <Balancer>{name}</Balancer>
              </h1>
              <h2 className="m-0 font-serif text-3xl font-thin">
                <Balancer>{penName}</Balancer>
              </h2>
            </div>
          </div>

          <Watermark className="absolute bottom-10 left-0" />
        </div>
      </div>
    </>
  );
};
