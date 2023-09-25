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
        {emoji}
        <span className="nn-bg-background nn-border ml-2 rounded-sm border px-2 py-1 font-mono text-lg font-normal">
          {date}
        </span>{" "}
        - {title}
      </h2>
      {children}
    </div>
  );
};
