import React from 'react';

export default () => (
  <div className="ac-b-credit-balloon">
    <div className="ac-b-credit-balloon__company">
      <span className="ac-b-credit-balloon__company__name">VISA,Master,JCB</span>
      <span className="ac-b-credit-balloon__company__desc">カード裏面（3桁）</span>
      <img
        className="ac-b-credit-balloon__company__thumb"
        src="/assets/images/common/security_code_default.png"
        alt=""
      />
    </div>
    <div className="ac-b-credit-balloon__company">
      <span className="ac-b-credit-balloon__company__name">American Express</span>
      <span className="ac-b-credit-balloon__company__desc">カード表面（4桁）</span>
      <img
        className="ac-b-credit-balloon__company__thumb"
        src="/assets/images/common/security_code_american_express.png"
        alt=""
      />
    </div>
  </div>
);
