import React from 'react'
import { SensorQuality } from '../domain/sensorData'
import { css } from 'emotion'
import { typedStyles } from '../../app/theme/styleHelpers'

type Props = {
  label: string
  value: number
  valueUnit: string | JSX.Element
  quality: SensorQuality
}

const SingleSensorDataItem: React.FC<Props> = (props) => {
  const wrapperQualityStyle = wrapperColorStyle(props.quality)

  const qualityText = getQualityText(props.quality)

  return (
    <div className={css(styles.textLine, styles.wrapper, wrapperQualityStyle)}>
      <dt className={css(styles.textLine, styles.heading)}>{props.label}</dt>
      <dd>
        <p className={css(styles.textLine)}>
          <span className={css(styles.value)}>{props.value}</span>{' '}
          <span className={css(styles.valueUnit)}>{props.valueUnit}</span>
        </p>
        {qualityText && (
          <p className={css(styles.textLine, styles.quality)}>{qualityText}</p>
        )}
      </dd>
    </div>
  )
}

function getQualityText(sensorQuality: SensorQuality): string {
  switch (sensorQuality) {
    case SensorQuality.Terrible:
      return 'TERRIBLE'
    case SensorQuality.Bad:
      return 'BAD'
    case SensorQuality.Good:
      return ''
    case SensorQuality.DependsOnContext:
      return ''
  }
}

function wrapperColorStyle(sensorQuality: SensorQuality) {
  switch (sensorQuality) {
    case SensorQuality.Terrible:
      return styles.wrapperTerrible
    case SensorQuality.Bad:
      return styles.wrapperBad
    case SensorQuality.Good:
      return styles.wrapperGood
    case SensorQuality.DependsOnContext:
      return styles.wrapperDependsOnContext
  }
}

const styles = typedStyles({
  wrapper: {
    width: '160px',
    paddingTop: '10px',
    paddingBottom: '20px',
    textAlign: 'center',
  },
  wrapperTerrible: {
    backgroundColor: '#fad1d0',
  },
  wrapperBad: {
    backgroundColor: '#f8d568',
  },
  wrapperGood: {
    backgroundColor: '#90EE90',
  },
  wrapperDependsOnContext: {
    backgroundColor: '#add8e6',
  },
  textLine: {
    padding: '8px',
  },
  heading: {
    fontSize: '20px',
  },
  value: {
    fontSize: '24px',
    fontWeight: 'bold',
  },
  valueUnit: {
    fontSize: '20px',
  },
  quality: {
    fontSize: '20px',
    fontWeight: 'bold',
  },
})

export default SingleSensorDataItem
