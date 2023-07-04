"use server";

interface CountryCodeNameProps {
  code?: string | null;
  children: (countryName: string) => React.ReactNode;
}

export const CountryCodeName = ({ code, children }: CountryCodeNameProps) => {
  if (!code) return null;

  const regionNamesInEnglish = new Intl.DisplayNames(["en"], {
    type: "region",
  });

  const countryName = regionNamesInEnglish.of(code);

  if (!countryName) return null;

  return <>{children(countryName)}</>;
};
