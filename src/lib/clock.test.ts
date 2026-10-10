import { describe, expect, it } from "vitest";

import { clockFace } from "./clock";

describe("clockFace", () => {
  it("pads both parts to two digits", () => {
    expect(clockFace(0)).toBe("00:00");
    expect(clockFace(5)).toBe("00:05");
  });

  it("rolls seconds into minutes", () => {
    expect(clockFace(59)).toBe("00:59");
    expect(clockFace(60)).toBe("01:00");
    expect(clockFace(61)).toBe("01:01");
  });

  it("renders the default session lengths", () => {
    expect(clockFace(25 * 60)).toBe("25:00");
    expect(clockFace(5 * 60)).toBe("05:00");
    expect(clockFace(15 * 60)).toBe("15:00");
  });

  it("does not wrap past an hour", () => {
    expect(clockFace(90 * 60)).toBe("90:00");
  });
});
