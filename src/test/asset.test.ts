import { createCovenants } from "../asset";

test("asset test", () => {
  const rest = createCovenants(15, 0);

  console.log(rest);
});
