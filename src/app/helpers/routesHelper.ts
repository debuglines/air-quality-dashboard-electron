import { GraphType } from '../../graph/types'

export function dashboardRoute(): string {
  return '/'
}

export function syncPath(): string {
  return '/sync'
}

export function graphPathIndex(): string {
  return '/chart/:graphType'
}

export function chartPath(graphType: GraphType): string {
  return `/chart/${graphType}`
}

export const rootRoute = dashboardRoute
