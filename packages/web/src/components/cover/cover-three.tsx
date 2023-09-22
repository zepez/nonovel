interface Props {
  background: string;
  name: string;
  penName: string;
}

export const CoverThree = ({ background, name, penName }: Props) => {
  return (
    <>
      <div className="relative flex h-[900px] w-[600px] flex-col items-center justify-end pb-32 text-center font-bold text-[#331F14]">
        <img
          src={`data:image/jpeg;base64,${background}`}
          className="cover-simple-border-inset absolute inset-0 h-full w-full object-cover"
        />

        <div className="cover-svg-overlay-two relative z-10 w-[400px] rounded-md px-4 py-12">
          <h1 className="balance-text mb-6 mt-4 font-serif text-5xl italic leading-snug">
            {name}
          </h1>
          <h2 className="balance-text m-0 font-serif text-3xl font-thin">
            {penName}
          </h2>
        </div>
      </div>
    </>
  );
};
