import Script from "next/script";

export const Analytics = () => {
  return (
    <Script
      defer
      data-domain="nonovel.io"
      src="https://plausible.io/js/script.js"
    />
  );
};
