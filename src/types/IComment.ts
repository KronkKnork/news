export interface IComment {
  by: string
  id: number
  parent: number
  text: string
  time: number
  type: string
  kids?: JSX.Element
}
