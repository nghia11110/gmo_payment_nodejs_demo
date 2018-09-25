import gmoPaymentServie from './gmo-payment.service';

// Exported controller methods
export default {
  charge,
};

export async function charge(req, res) {
  try {
    const result = await gmoPaymentServie._charge(req.body.params);
    res.json(result);
  } catch(e) {
    res.status(e.status).send(e.message);
  }
}
