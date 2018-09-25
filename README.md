# Demo gmo-payment with credit card

- Client side by react/redux/webpack
- Server side by nodejs (express)

## Development Mode

Copy environment variables and edit them if necessary:

```
cp .env.example .env
```

Then:

```
npm install
npm start
```

Direct your browser to `http://localhost:3000`.

## Giới thiệu
GMO là cổng dịch vụ thanh toán lón của Nhật, hỗ trợ nhiều hình thức thanh toán (credit card, multipayment như pay-easy, convenience-store ...)
Về lí thuyết có thể tham khảo thêm ở https://viblo.asia/p/tim-hieu-ve-cong-thanh-toan-gmo-3P0lPvMpKox để hiểu rõ hơn cơ chế hoạt động của payment platform.

Repo này sẽ hướng dẫn cách implement sample hệ thống thanh toán dùng credit card qua GMO payment API viết bằng nodejs

## Cách thực thi

### Đăng kí tài khoản test
Để bắt đầu làm việc với GMO API bạn cần phải đăng kí 1 tài khoản test qua https://service.gmo-pg.com/cyllene/entry/trialStart.htm
Sau khi đăng kí bạn sẽ nhận được email gửi thông tin username, password cho màn hình quản lí Site và Shop. Ở đây có 2 khái niệm Site và Shop khi làm việc với  GMO  API.
- Site là nơi quản lí thông tin của user như memberid, credit card info.
- Shop là nơi quản lí thông các transaction khi thực hiện thanh toán với thông tin user ở trên. Mỗi thanh toán thành công sẽ trả về một giá trị orderId riêng. Ở màn hình quản lí Site có thể confirm status của thanh toán cũng như cancel thanh toán đó.

Tiếp theo sẽ đi vào phần implement code

### Tạo file config
Đầu tiên cần tạo file config.json để lưu thông tin Site và Shop của hệ thống.
Cần chia ra làm 2 phần tách biệt giữa 2 môi trường development và production.
Thông tin về id và password trên development sẽ lấy được thông qua trang quản lí đã đăng kí ở trên trong phần Site management -> Site information và Site management -> Shop information.
Lúc deploy hệ thống lên môi trường thật sẽ cần phải đăng kí để lấy thông tin Site và Shop mới dùng cho môi trường production.
```
{
  "SHOP_CONFIG": {
    "development": {
      "id": "tshop00035429",
      "host": "kt01.mul-pay.jp",
      "password": "********"
    },
    "production": {
      "id": "",
      "host": "",
      "password": ""
    }
  },
  "SITE_CONFIG": {
    "development": {
      "id": "tsite00031571",
      "host": "kt01.mul-pay.jp",
      "password": "********"
    },
    "production": {
      "id": "",
      "host": "",
      "password": ""
    }
  }
}
```

### Download package GMO for nodejs
Việc kết nối với payment API trong các ngôn ngữ đa phần đều đã có các lib được xây dựng sẵn. Ở đây mình dùng lib gmo-payment-node để thao tác với GMO API.
Download:
```
npm i --save gmo
```

### Tạo constructor class
Tiếp theo tạo class để khởi tạo đối tượng GMO với config ở trên và thực hiện kết nối tới API.
```
import gmo from 'gmo';
import co from 'co';
import Q from 'q';
import config from '@utils/gmo/config';

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
}

export default new GmoManager();
```
Những function phía dưới sẽ được khai báo ở trong class này.

### Hàm searchMember
Hàm này kiểm tra xem memberID đã được đăng kí trên site hay chưa.
```
/**
 * Get Member Info。
 */
async searchMember(memberId /*number*/) {
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
```

### Hàm saveMember
Thực hiện đăng kí thông tin id và name của user
```
/**
 * type GmoMember = {
 *   member_id: number,
 *   member_name: string,
 * };
 * register member to site。
 * return error if existed
 */
async saveMember(member /* GmoMember */) {
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
```

### Hàm saveCard
Hàm này thực hiện việc lưu thông tin credit card của user.
Nếu thông tin thẻ không hợp lệ sẽ trả về lỗi.
```
/*
type Card = {
  member_id: number,
  card_no: string,
  card_seq: string,
  expire: string,
};
*/
/**
 * register and save card
 */
async saveCard(card /* Card */) {
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
```

### Hàm charge
Thực hiện việc tạo một thanh toán.
Sẽ trả về một orderId ngẫu nhiên nếu thanh toán thành công và error nếu thanh toán thất bại.
```
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
```
Cụ thể hơn về đoạn code trên:
- Tạo một giá trị orderID đảm bảo là duy nhất để phân biệt các thanh toán khác nhau
- Gửi một requesst EntryTran tới SHOP API để đăng kí orderID, job_cd và price trong thanh toán lần này. (job_cd là CAPTURE có nghĩa là thực hiện trừ tiền ngay lập tức. tham khảo thêm về các loại job_cd ở reference (1)).
- Dùng AccessID và AccessPass mà SHOP API trả về ở trên cộng với thông tin user để thực hiện thanh toán. Thông tin sẽ được gửi đến công ty cung cấp credit card.

## Test
Qui trình thực thi một thanh toán sau khi nhận được info từ phía client sẽ như sau:
- gọi hàm searchMember để kiểm tra user đã đăng kí hay chưa
- nếu chưa có thực hiện saveMember và saveCard để lưu thông tin lại
- gọi hàm charge để thực hiện thanh toán và trả kết quả về client

Lưu ý là ở môi trường development chỉ cần credit number thoả mãn luật Luhn (reference (3)) là có thể pass để thực hiện test nhưng trên môi trường production sẽ check chính xác là thẻ có hợp lệ ở hiện tại hay không.

## Reference
- http://ci.german-ex.com/gmo/index.html (1)
- https://gist.github.com/jagdeepsingh/60c2322cccbf5f9a35d49b3a0c76267b (2)
- https://vi.wikipedia.org/wiki/Lu%E1%BA%ADt_Luhn_Check_Digit (3)

