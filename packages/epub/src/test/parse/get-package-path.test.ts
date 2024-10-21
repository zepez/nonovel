import { expect, test } from "vitest";
import { getPackagePath } from "../../lib/parse";

test("returns opf path as string", () => {
  const metaInfContent = `
    <?xml version="1.0" encoding="UTF-8" ?>
      <container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
        <rootfiles>
            <rootfile full-path="OPS/fb.opf" media-type="application/oebps-package+xml"/>
        </rootfiles>
      </container>
    </xml>
  `;

  expect(getPackagePath(metaInfContent)).toBe("OPS/fb.opf");
});

test("throws when meta-inf is empty string", () => {
  expect(() => getPackagePath("")).toThrowError("Failed to get OPF path");
});

test("throws when opf path is not found", () => {
  const metaInfContentNoOpfPath = `
    <?xml version="1.0" encoding="UTF-8" ?>
      <container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
        <rootfiles>
            <rootfile media-type="application/oebps-package+xml"/>
        </rootfiles>
      </container>
    </xml>
  `;

  expect(() => getPackagePath(metaInfContentNoOpfPath)).toThrowError(
    "Failed to get OPF path"
  );
});
