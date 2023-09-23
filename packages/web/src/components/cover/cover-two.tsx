interface Props {
  background: string;
  name: string;
  penName: string;
}

export const CoverTwo = ({ background, name, penName }: Props) => {
  return (
    <>
      <div className="h-[900px] w-[600px] text-center font-bold text-[#331F14]">
        <div className="cover-svg-overlay-one relative h-full w-full">
          <img
            src={`data:image/jpeg;base64,${background}`}
            className="h-full w-full object-cover"
          />
          <div className="absolute left-0 top-0 w-full">
            <div className="cover-simple-border cover-simple-border-inset mx-auto mt-32 w-[475px] bg-[#F5E1C9] px-4 py-8">
              <h1 className="balance-text mb-4 font-serif text-5xl italic leading-snug">
                {name}
              </h1>
              <h2 className="balance-text m-0 font-serif text-3xl font-thin">
                {penName}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
