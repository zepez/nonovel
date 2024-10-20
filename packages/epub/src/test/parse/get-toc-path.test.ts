import { expect, test } from "vitest";
import { getTocPath } from "../../lib/parse";

const getFilePath = (fileName?: string | null) => fileName ?? null;

test("throws when spine is missing or malformed", () => {
  expect(() => getTocPath(getFilePath, "")).toThrowError(
    "Failed to get TOC ID"
  );

  const missingSpineOpfContent = `
    <?xml version="1.0" encoding="UTF-8" ?>
      <package version="2.0" unique-identifier="PrimaryID" xmlns="http://www.idpf.org/2007/opf">
        <manifest>
          <item id="ncx"
            href="fb.ncx"
            media-type="application/x-dtbncx+xml"/>
        </manifest>
      </package>
    </xml>
  `;

  expect(() => getTocPath(getFilePath, missingSpineOpfContent)).toThrowError(
    "Failed to get TOC ID"
  );

  const badSpineOpfContent = `
    <?xml version="1.0" encoding="UTF-8" ?>
      <package version="2.0" unique-identifier="PrimaryID" xmlns="http://www.idpf.org/2007/opf">
        <manifest>
          <item id="ncx"
            href="fb.ncx"
            media-type="application/x-dtbncx+xml"/>
        </manifest>

        <spine></spine>
      </package>
    </xml>
  `;

  expect(() => getTocPath(getFilePath, badSpineOpfContent)).toThrowError(
    "Failed to get TOC ID"
  );
});

test("throws when manifest does not reference TOC", () => {
  const missingManifestOpfContent = `
    <?xml version="1.0" encoding="UTF-8" ?>
      <package version="2.0" unique-identifier="PrimaryID" xmlns="http://www.idpf.org/2007/opf">
        <spine toc="ncx"></spine>
      </package>
    </xml>
  `;

  expect(() => getTocPath(getFilePath, missingManifestOpfContent)).toThrowError(
    "Failed to get TOC path"
  );

  const badManifestOpfContent = `
    <?xml version="1.0" encoding="UTF-8" ?>
      <package version="2.0" unique-identifier="PrimaryID" xmlns="http://www.idpf.org/2007/opf">
        <manifest>
          <item id="ncx"
            media-type="application/x-dtbncx+xml"/>
        </manifest>

        <spine toc="ncx"></spine>
      </package>
    </xml>
  `;

  expect(() => getTocPath(getFilePath, badManifestOpfContent)).toThrowError(
    "Failed to get TOC path"
  );
});

test("returns the correct TOC path", () => {
  const tocPath = "fb.ncx";
  const goodOpfContent = `
    <?xml version="1.0" encoding="UTF-8" ?>
      <package version="2.0" unique-identifier="PrimaryID" xmlns="http://www.idpf.org/2007/opf">
        <manifest>
          <item id="ncx"
            href="fb.ncx"
            media-type="application/x-dtbncx+xml"/>
        </manifest>

        <spine toc="ncx"></spine>
      </package>
    </xml>
  `;

  const path = getTocPath(getFilePath, goodOpfContent);
  expect(path).toBe(tocPath);
});
