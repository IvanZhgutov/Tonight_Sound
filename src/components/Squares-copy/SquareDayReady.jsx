import { months } from "../../general/constats"

export const SquareDayReady = ({ handleSwitchStatus, todayDay, todayMonth }) => {

  return (
    <div onClick={handleSwitchStatus} className="squares">
      <div className="square">
        <span className="top-span gray-text">Сегодня</span>
        <div className='accent-container'>
          <span className="accent">{todayDay}</span>
          <span className="month">{todayMonth}</span>
        </div>
        <span className="bottom-span green-text">Есть свободные часы!<br />Записывайся!</span>
      </div>
      <div className="square months-wrapper px-6 py-4">
        <div className="months">
          {months.map((month, index) => (
              <div className={`month ${month.status}`}>{month.title}</div>
          ))}
        </div>
      </div>
    </div>
  )
}