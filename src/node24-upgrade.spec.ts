describe("Node 24 + TypeScript 5.9.3 Upgrade Verification", () => {
  describe("Node.js 24 Runtime", () => {
    it("should be running on Node.js 24+", () => {
      const major = parseInt(process.versions.node.split(".")[0], 10);
      expect(major).toBeGreaterThanOrEqual(24);
    });

    it("should have URLPattern available globally", () => {
      expect(typeof URLPattern).not.toBe("undefined");
    });

    it("should have navigator global available", () => {
      expect(typeof navigator).toBe("object");
    });

    it("should not export deprecated type checking utilities from util", () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const util = require("util");
      expect(util.isNumber).toBeUndefined();
      expect(util.isString).toBeUndefined();
      expect(util.isBoolean).toBeUndefined();
    });

    it("should support structuredClone", () => {
      const obj = { nested: { value: 42 }, arr: [1, 2, 3] };
      const clone = structuredClone(obj);
      expect(clone).toEqual(obj);
      expect(clone).not.toBe(obj);
      expect(clone.nested).not.toBe(obj.nested);
    });

    it("should support Set composite operations", () => {
      const a = new Set([1, 2, 3]);
      const b = new Set([2, 3, 4]);
      expect(a.intersection(b)).toEqual(new Set([2, 3]));
      expect(a.union(b)).toEqual(new Set([1, 2, 3, 4]));
      expect(a.difference(b)).toEqual(new Set([1]));
      expect(a.symmetricDifference(b)).toEqual(new Set([1, 4]));
      expect(a.isSubsetOf(new Set([1, 2, 3, 4]))).toBe(true);
    });

    it("should support Promise.withResolvers", () => {
      const { promise, resolve } = Promise.withResolvers<string>();
      expect(promise).toBeInstanceOf(Promise);
      resolve("done");
      return expect(promise).resolves.toBe("done");
    });
  });

  describe("TypeScript 5.9.3 Compatibility", () => {
    it("should handle stricter nullish coalescing correctly", () => {
      const value: string | null = null;
      const result = value ?? "default";
      expect(result).toBe("default");
    });

    it("should support satisfies operator", () => {
      type Color = "red" | "green" | "blue";
      const palette = {
        red: [255, 0, 0],
        green: "#00ff00",
        blue: [0, 0, 255],
      } satisfies Record<Color, string | number[]>;
      expect(palette.red[0]).toBe(255);
    });

    it("should support const type parameters", () => {
      function asConst<const T>(value: T): T {
        return value;
      }
      const result = asConst([1, 2, 3] as const);
      expect(result).toEqual([1, 2, 3]);
    });
  });
});
