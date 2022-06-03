import { IList } from 'types/weather'
import styles from './dayitem.module.scss'
import Clouds from 'assets/img/Clouds.png'
import dayjs from 'dayjs'

interface IProps {
  data: IList[] | undefined
}

const DayItem = ({ data }: IProps) => {
  return (
    <ul className={styles.wrapper}>
      {data?.map((list: IList) => (
        <li key={list.dt}>
          <img src={Clouds} alt='weatherImage' />
          <time>
            <b>{dayjs(list.dt_txt).format('h A ')}</b>
            {dayjs(list.dt_txt).format('ddd')}
          </time>
          <span>{Math.round(list.main.temp)}</span>
        </li>
      ))}
    </ul>
  )
}

export default DayItem
