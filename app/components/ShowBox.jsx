import { withSuffix } from '../utils/helpers'

export default function ShowBox({ label, text, suffix }) {
  const displayLabel = suffix ? withSuffix(label, suffix) : label

  return (
    <dl className="show-box">
      <dt className="show-box-label">{ displayLabel }</dt>
      <dd className="show-box-value">{ text }</dd>
    </dl>
  )
}