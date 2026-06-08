export const Day = ({ button }) => {
  return (
    <div key={button.id} className={`calendar-button-wrapper wrapper-${button.status}`}>
      <button className={`calendar-button ${button.status}`}>
        {button.title}
      </button>
    </div>
  )
}