import gmo from 'gmo';
import co from 'co';
import Q from 'q';
import config from '@utils/gmo/config';
// import logger from '../logger';

/*
type GmoMember = {
  member_id: number,
  member_name: string,
};

type Card = {
  member_id: number,
  card_no: string,
  card_seq: string,
  expire: string,
};

type Response = {
  status: boolean,
  error?: Object,
  result?: {
    MemberID: string,
    MemberName?: string,
    DeleteFlag?: string,
    httpStatusCode: number,
  },
};
*/

const {
  SHOP_CONFIG,
  SITE_CONFIG,
} = config;

class GmoManager {
  constructor() {
    this.shop = new gmo.ShopAPI({
      host: SHOP_CONFIG.host,
      shop_id: SHOP_CONFIG.id,
      shop_pass: SHOP_CONFIG.password,
    });

    this.site = new gmo.SiteAPI({
      host: SITE_CONFIG.host,
      site_id: SITE_CONFIG.id,
      site_pass: SITE_CONFIG.password,
    });
  }

  /**
   * 会員登録を行う。
   * この時すでにIdが登録されていた場合はエラーが返される
   */
  async saveMember(member) {
    const response = await co(async() => {
      const result = await Q.ninvoke(this.site, 'saveMember', member);

      return {
        status: true,
        result,
      };
    }).catch((e) => {
      // logger.system.error(`GMO[saveMember]: ${JSON.stringify(e)}`);
      return {
        status: false,
        error: e,
      };
    });

    return response;
  }

  /**
   * Memberを取得する。
   */
  async searchMember(memberId) {
    const response = await co(async() => {
      const result = await Q.ninvoke(this.site, 'searchMember', { member_id: memberId });

      return {
        status: true,
        result,
      };
    }).catch((e) => {
      // logger.system.error(`GMO[searchMember]: ${e}`);
      return {
        status: false,
        error: e,
      };
    });

    return response;
  }

  /**
   * カードの登録
   * これを登録することによってカードが保存される。
   * カードの情報の更新はなく。事実上追加されることとなるのでカード情報を更新したい場合はこちらをコールする
   */
  async saveCard(card) {
    const _card = card;
    const response = await co(async() => {
      const result = await Q.ninvoke(this.site, 'saveCard', _card);
      return {
        status: true,
        result,
      };
    }).catch((e) => {
      // logger.system.error(`GMO[saveCard]: ${JSON.stringify(e)}`);
      return {
        status: false,
        error: e,
      };
    });

    return response;
  }

  /**
   * getCardInfo
   * 後から追加されたカードのcard_seqは連番で最大になる
   * そのため、０からエラーがでるまで繰り返し、初めてエラーが出た時その結果を返す。
   * これが最新のカード情報になる。
   * こいつをどうしていいのか疑問
   */
  async getCardInfo(memberId) {
    const response = await co(async() => {
      const cardInfo = {
        member_id: memberId,
        card_seq: '0',
        seq_mode: '0',
      };
      const result = await Q.ninvoke(this.site, 'searchCard', cardInfo);

      return {
        status: true,
        result,
      };
    }).catch((e) => {
      return {
        status: false,
        error: e,
      };
    });

    return response;
  }

  async charge(userId, price, tax, securityCode) {
    const orderId = (`${userId}${Date.now()}${(`${Math.random()}`).replace('.', '')}`).substring(0, 20);

    const shopEntryTran = {
      order_id: orderId,
      job_cd: 'CAPTURE',
      amount: price,
      tax,
    };

    return co(async() => {
      try {
        const shopResponse = await Q.ninvoke(this.shop, 'entryTran', shopEntryTran);
        const siteExecTran = {
          access_id: shopResponse.AccessID,
          access_pass: shopResponse.AccessPass,
          order_id: orderId,
          method: '1',
          pay_times: '1',
          member_id: userId,
          seq_mode: '0',
          card_seq: '0',
          security_code: securityCode,
        };
        await Q.ninvoke(this.site, 'execTran', siteExecTran);
      } catch (e) {
        throw e;
      }

      return {
        orderId,
      };
    }).catch((e) => {
      // logger.system.error(`GMO[buyItem]: ${JSON.stringify(e)}`);
      throw e;
    });
  }
}

export default new GmoManager();
