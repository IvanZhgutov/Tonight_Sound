import { SvgClose } from "../../assets/icons/SvgClose"
import { SvgNo } from "../../assets/icons/SvgNo"
import { months } from "../../general/constats"

export const SquareNoDay = ({ handleSwitchStatus, todayDay, todayMonth, activeDay }) => {

  return (
    <div onClick={handleSwitchStatus} className="squares">
      <div className="square full">
      {/* <div className="square noday"> */}
        <div className="header">
        {/* <span className="top-span gray-text">Сегодня</span> */}
          <div className='accent-container'>
            <span className="accent">{todayDay}</span>
            <span className="month">{todayMonth}</span>
          </div>
          <div className="hr"></div>
          <div className="right-header">
            <span className="gray-text">Часы на студии:</span>
            <div className="time-studio-container">
              <div className="time-studio">
                <div>10:00 <button><SvgClose /></button></div>
              </div>
              <div className="time-studio">
                <div>13:00 <button><SvgClose /></button></div>
              </div>
              <div className="time-studio">
                <div>14:00 <button><SvgClose /></button></div>
              </div>
            </div>
          </div>
        </div>
        <div className="info-content gray-text">
          Общее время: 3 часа <br />Цена: 1500р
        </div>
        <button className="button inactive"><SvgNo /> Отмена</button>
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