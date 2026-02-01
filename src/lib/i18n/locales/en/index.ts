import common from "./modules/common.json";
import billing from "./modules/billing.json";
// Merge all translations into a single object
const en = {
  ...common,
  ...billing,
};

export default en;
