interface UpdateProps {
  date: string;
  emoji: string;
  title: string;
  children: React.ReactNode;
}

export const Update = ({ children, date, emoji, title }: UpdateProps) => {
  return (
    <div>
      <h2 className="mb-2 text-xl font-bold leading-loose">
        {emoji} {title}{" "}
        <span className="ml-2 rounded-sm font-mono text-sm font-normal">
          {date}
        </span>
      </h2>
      {children}
    </div>
  );
};
