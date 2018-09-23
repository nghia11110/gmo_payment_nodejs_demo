/* eslint import/no-mutable-exports: off */
import {
  SHOP_CONFIG,
  SITE_CONFIG,
} from '@config/gmo.json';
// import fs from 'fs';
// import path from 'path';
import env from '../env';

let config = {
  SHOP_CONFIG: SHOP_CONFIG[env],
  SITE_CONFIG: SITE_CONFIG[env],
};

if (env === 'production') {
  // let gmoProductionConfig = fs.readFileSync(path.join(__dirname, '../../../../../../gmo.json'), 'utf-8');
  // gmoProductionConfig = JSON.parse(gmoProductionConfig);
  // config = {
  //   SHOP_CONFIG: gmoProductionConfig.SHOP_CONFIG,
  //   SITE_CONFIG: gmoProductionConfig.SITE_CONFIG,
  // };
}

export default config;
