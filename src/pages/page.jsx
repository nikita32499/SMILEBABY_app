import style from './style.module.scss';
import { SectionsList } from '../components/SectionsList/SectionsList';

export const Home=()=>{
  return (
      <div className={style.home}>
        <SectionsList/>
        <div className={style.home__welcome_box}>
          <h1>Онлайн магазин стильной детской одежды из Турции по доступным ценам!
Бренды zara🇹🇷, h&m, vauva, c&a и другие.</h1>
          <h2>Одежда очень удобная, красивая и невероятно качественная.</h2>
          <h3>Отправка в любой город. Доставка по России-СДЕК, авито доставка, почта, boxberry, яндекс доставка. Оперативная отправка. Самовывоз и примерка г. Ярославль, Фрунзенский район.</h3>
        </div>
      </div>
  );
}

