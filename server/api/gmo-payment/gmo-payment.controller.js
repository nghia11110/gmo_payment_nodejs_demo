import gmo from '$utils/gmo';

const TAX = 0.08;

export async function charge(req, res) {
  const {
    security_code: securityCode,
    token,
    member_name: memberName,
    member_id: memberId,
    price,
    card_number: cardNumber,
    expire_month: expireMonth,
    expire_year: expireYear,
  } = req.body.params;

  // gmoにユーザー情報があるかの確認
  const memberGmo = await gmo.searchMember(memberId);

  // GMOにユーザー情報がない場合
  if (!memberGmo.status) {
    await gmo.saveMember({
      member_name: memberName,
      member_id: memberId,
    });
  } else {
    //
  }

  const card = {
    member_id: memberId,
    security_code: securityCode,
    card_no: cardNumber,
    default_flag: 1,
    seq_mode: '0',
    method: '1',
    expire: `${expireYear}${expireMonth}`,
    card_seq: '',
  };
  const cardInfo = await gmo.getCardInfo(memberId);

  if (cardInfo.status) {
    card.card_seq = '0';
  }

  try {
    const response = await gmo.saveCard(card);
    if (!response.status) {
      throw response.error;
    }
  } catch (e) {
    throw e;
  }

  const tax = price * TAX;
  const result = await gmo.charge(memberId, price, tax, securityCode);
  const gmoOrderId = result.orderId;

  return res.json(gmoOrderId);
}

// Exported controller methods
export default {
  charge,
};