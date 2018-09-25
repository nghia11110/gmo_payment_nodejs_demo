import gmo from '$utils/gmo';
import error from '$utils/error';

const TAX = 0.08;

class GmoPaymentService {
  async _charge(params) {
    const {
      security_code: securityCode,
      // token,
      member_name: memberName,
      member_id: memberId,
      price,
      card_number: cardNumber,
      expire_month: expireMonth,
      expire_year: expireYear,
    } = params;

    // gmoにユーザー情報があるかの確認
    const memberGmo = await gmo.searchMember(memberId);

    // GMOにユーザー情報がない場合
    if (!memberGmo.status) {
      try {
        await gmo.saveMember({
          member_name: memberName,
          member_id: memberId,
        });
      } catch(e) {
        throw error(400, 'Cannot save member!');
      }
    }

    // save card when having card_number
    if (cardNumber) {
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
          throw error(400, 'Cannot save card because credit card is wrong!');
        }
      } catch (e) {
        throw error(400, 'Cannot save card because credit card is wrong!');
      }
    }

    try {
      const tax = price * TAX;
      const result = await gmo.charge(memberId, price, tax, securityCode);

      return result.orderId;
    } catch(e) {
      throw error(400, 'Cannot charge!');
    }
  }
}

export default new GmoPaymentService();