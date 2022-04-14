import { createCovenants } from "../pool";

test("asset test", () => {
  const rest = createCovenants(15, 0, "");

  console.log(rest);
});
