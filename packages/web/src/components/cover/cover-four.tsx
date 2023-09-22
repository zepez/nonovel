interface Props {
  background: string;
  name: string;
  penName: string;
}

export const CoverFour = ({ background, name, penName }: Props) => {
  return (
    <>
      <div className="h-[900px] w-[600px] text-center font-bold text-[#331F14]">
        <div className="relative w-full h-full cover-svg-overlay-three">
          <img
            src={`data:image/jpeg;base64,${background}`}
            className="object-cover w-full h-full"
          />
          <div className="absolute top-0 left-0 w-full">
            <div className="cover-simple-border cover-simple-border-inset mx-auto mt-32 w-[475px] bg-[#F5E1C9] px-4 pb-8 pt-4">
              <h1 className="mt-4 mb-4 font-serif text-5xl italic leading-snug balance-text">
                {name}
              </h1>
              <h2 className="m-0 font-serif text-3xl font-thin balance-text">
                {penName}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
