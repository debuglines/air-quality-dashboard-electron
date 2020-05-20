import { css } from 'emotion'
import React from 'react'
import { Link } from 'react-router-dom'
import { graphPath } from '../../app/routesHelper'
import { typedStyles } from '../../app/theme/styleHelpers'
import { GraphType } from '../../graph/types'
import { SensorQuality } from '../domain/sensorData'

type Props = {
  label: string
  value: number
  valueUnit: string | JSX.Element
  quality: SensorQuality
  graphType: GraphType
}

const SingleSensorDataItem: React.FC<Props> = (props) => {
  const wrapperQualityStyle = wrapperColorStyle(props.quality)

  const qualityText = getQualityText(props.quality)

  return (
    <Link
      to={graphPath(props.graphType)}
      className={css(styles.textLine, styles.wrapper, wrapperQualityStyle)}
    >
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
    </Link>
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
    display: 'block',
    textDecoration: 'none',
    color: '#000',
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
