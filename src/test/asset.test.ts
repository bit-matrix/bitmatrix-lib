import { calculateAssetId } from "../asset";

test("asset test", () => {
  const rest = calculateAssetId("933e9a56af45c45be3b9050f2430bcac5e639a1e68199d2912da9bd89c99fbe1", "2c4b31700fd1a93f25db0a70037c38c812b61441d0aeb757824cbb1d366d3c23", 1);

  console.log(rest);
});
