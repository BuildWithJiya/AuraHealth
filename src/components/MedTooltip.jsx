export default function MedTooltip({ term, children }) {
  return (
    <span className="med-tooltip">
      {children}
      <span className="tip">{term}</span>
    </span>
  )
}
