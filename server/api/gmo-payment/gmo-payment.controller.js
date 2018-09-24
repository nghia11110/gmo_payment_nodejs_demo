import gmo from '$utils/gmo';

export async function charge(req, res) {
  console.log(req);
  return res.json(req);
}

// Exported controller methods
export default {
  charge,
};