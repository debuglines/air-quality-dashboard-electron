import { differenceInMinutes } from 'date-fns'
import { css } from 'emotion'
import React from 'react'
import { dateFromTimezone, dateWithTimezone } from '../../app/helpers'
import { typedStyles } from '../../app/theme/styleHelpers'
import { GraphType } from '../../graph/types'
import {
  co2Quality,
  humidityQuality,
  overallQuality,
  pressureQuality,
  radonShortTermQuality,
  SensorData,
  SensorQuality,
  temperatureQuality,
  vocQuality,
} from '../domain/sensorData'
import SingleSensorDataItem from './SingleSensorDataItem'

type Props = {
  sensorData: SensorData
}

const SensorDataOverviewWidget: React.FC<Props> = (props) => {
  const { sensorData } = props

  const differenceMinutes = differenceInMinutes(
    dateFromTimezone(new Date()),
    sensorData.datetimeUtc,
  )

  return (
    <section>
      <header>
        <p>
          Overall air quality [{getQualityText(overallQuality(sensorData))}]
        </p>
        <p>
          Latest data from:{' '}
          {dateWithTimezone(sensorData.datetimeUtc).toString()}
        </p>
        <p>Relative time: {differenceMinutes} minutes ago</p>
      </header>

      <dl className={css(styles.wrapper)}>
        <SingleSensorDataItem
          label="Radon"
          value={sensorData.radonShortTermAverage}
          valueUnit={
            <>
              Bq/m<sup>3</sup>
            </>
          }
          quality={radonShortTermQuality(sensorData)}
          graphType={GraphType.Radon}
        />
        <SingleSensorDataItem
          label="TVOC"
          value={sensorData.voc}
          valueUnit="ppb"
          quality={vocQuality(sensorData)}
          graphType={GraphType.Radon}
        />
        <SingleSensorDataItem
          label="CO2"
          value={sensorData.co2}
          valueUnit="ppm"
          quality={co2Quality(sensorData)}
          graphType={GraphType.Co2}
        />
        <SingleSensorDataItem
          label="Humidity"
          value={sensorData.humidity}
          valueUnit="%"
          quality={humidityQuality(sensorData)}
          graphType={GraphType.Humidity}
        />
        <SingleSensorDataItem
          label="Temperature"
          value={sensorData.temperatureInCelcius}
          valueUnit="°C"
          quality={temperatureQuality(sensorData)}
          graphType={GraphType.Temperature}
        />
        <SingleSensorDataItem
          label="Pressure"
          value={sensorData.pressure}
          valueUnit="mbar"
          quality={pressureQuality(sensorData)}
          graphType={GraphType.Pressure}
        />
      </dl>
    </section>
  )
}

function getQualityText(sensorQuality: SensorQuality): string {
  switch (sensorQuality) {
    case SensorQuality.Terrible:
      return 'TERRIBLE'
    case SensorQuality.Bad:
      return 'BAD'
    case SensorQuality.Good:
      return 'GOOD'
    case SensorQuality.DependsOnContext:
      return 'DEPENDS ON THE CONTEXT'
  }
}

const styles = typedStyles({
  wrapper: {
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'grid',
    gridTemplateColumns: 'auto auto auto',
    gridGap: '2px',
    gridColumnGap: '2px',
    justifyItems: 'center',
    justifyContent: 'center',
  },
})

export default SensorDataOverviewWidget
