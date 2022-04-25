import { calculateAssetId } from "../asset";
import { createCommitmentOutput } from "../commitmentOutput";

test("commitment output test", () => {
  const result = createCommitmentOutput("d55c1cffed395dac02042c4e4c8a0bc8aff9bb7a9a75fefec4bfa49aae0c83fb", "11");

  console.log(result);
});
