import { add } from './assets/js/test';
import './assets/font/iconfont.css';
import './assets/css/index.scss';

add(1, 2)
  .then((res) => {
    console.log(res, 'add');
  });
