import React from 'react'
import {
  SensorData,
  overallQuality,
  radonShortTermQuality,
  vocQuality,
  temperatureQuality,
  humidityQuality,
  co2Quality,
  pressureQuality,
  SensorQuality,
} from '../domain/sensorData'
import SingleSensorDataItem from './SingleSensorDataItem'
import { typedStyles } from '../../app/theme/styleHelpers'
import { css } from 'emotion'
import useRefreshIncrement from '../../app/hooks/useRefreshIncrement'

type Props = {
  sensorData: SensorData
}

const SensorDataOverviewWidget: React.FC<Props> = (props) => {
  const { sensorData } = props
  useRefreshIncrement(1000 * 30 * 5)

  return (
    <section>
      <header>
        <p>
          Overall air quality [{getQualityText(overallQuality(sensorData))}]
        </p>
        <p>Latest data from: {sensorData.datetimeUtc.toISOString()}</p>
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
        />
        <SingleSensorDataItem
          label="TVOC"
          value={sensorData.voc}
          valueUnit="ppb"
          quality={vocQuality(sensorData)}
        />
        <SingleSensorDataItem
          label="CO2"
          value={sensorData.co2}
          valueUnit="ppm"
          quality={co2Quality(sensorData)}
        />
        <SingleSensorDataItem
          label="Humidity"
          value={sensorData.humidity}
          valueUnit="%"
          quality={humidityQuality(sensorData)}
        />
        <SingleSensorDataItem
          label="Temperature"
          value={sensorData.temperatureInCelcius}
          valueUnit="°C"
          quality={temperatureQuality(sensorData)}
        />
        <SingleSensorDataItem
          label="Pressure"
          value={sensorData.pressure}
          valueUnit="mbar"
          quality={pressureQuality(sensorData)}
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
