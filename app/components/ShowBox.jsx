export default function ShowBox({ label, text }) {
  return (
    <dl className="show-box">
      <dt className="show-box-label">{ label }</dt>
      <dd className="show-box-value">{ text }</dd>
    </dl>
  )
}