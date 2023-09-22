interface Props {
  background: string;
  name: string;
  penName: string;
}

export const CoverOne = ({ background, name, penName }: Props) => {
  return (
    <>
      <div className="relative flex h-[900px] w-[600px] items-center justify-center text-center font-bold text-[#331F14]">
        <img
          src={`data:image/jpeg;base64,${background}`}
          className="absolute inset-0 object-cover w-full h-full cover-simple-border-inset"
        />

        <div className="cover-simple-border cover-simple-border-inset z-10 w-[475px] bg-[#F5E1C9] px-4 py-12">
          <h1 className="mt-4 mb-6 font-serif text-5xl italic leading-snug balance-text">
            {name}
          </h1>
          <h2 className="m-0 font-serif text-3xl font-thin balance-text">
            {penName}
          </h2>
        </div>
      </div>
    </>
  );
};
