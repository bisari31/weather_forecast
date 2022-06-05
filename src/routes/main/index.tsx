import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'

import styles from './main.module.scss'
import { getWeatherForecast5DaysApi } from 'services/weather'
import { IWeatherData } from 'types/weather'

import Screen from './Screen'
import DayList from './dayList/index'
import ChartList from './chartList'
import { geolocationState } from 'states/weather'

const Main = () => {
  const geolocation = useRecoilValue(geolocationState)
  const [data, setData] = useState<IWeatherData>()

  useEffect(() => {
    getWeatherForecast5DaysApi(geolocation).then((res) => {
      setData(res.data)
    })
  }, [geolocation])

  if (!data) return null

  return (
    <div className={styles.wrapper}>
      <Screen data={data} />
      <DayList data={data?.list} />
      <ChartList />
    </div>
  )
}

export default Main