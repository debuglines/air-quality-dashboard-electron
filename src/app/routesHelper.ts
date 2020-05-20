import { GraphType } from '../graph/types'

export function dashboardRoute(): string {
  return '/'
}

export function syncPath(): string {
  return '/sync'
}

export function graphPathIndex(): string {
  return '/graph/:graphType'
}

export function graphPath(graphType: GraphType): string {
  return `/graph/${graphType}`
}

export const rootRoute = dashboardRoute
