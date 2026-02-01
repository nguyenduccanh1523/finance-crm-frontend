import common from "./modules/common.json";
import billing from "./modules/billing.json";
// Merge all translations into a single object
const vi = {
  ...common,
  ...billing,
};

export default vi;
