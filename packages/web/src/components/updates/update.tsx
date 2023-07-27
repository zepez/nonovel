interface UpdateProps {
  date: string;
  emoji: string;
  title: string;
  children: React.ReactNode;
}

export const Update = ({ children, date, emoji, title }: UpdateProps) => {
  return (
    <div>
      <h2 className="mb-2 text-xl font-bold leading-loose nn-title">
        {emoji}
        <span className="px-2 py-1 ml-2 font-mono text-lg font-normal border rounded-sm nn-bg-background nn-border">
          {date}
        </span>{" "}
        - {title}
      </h2>
      {children}
    </div>
  );
};
