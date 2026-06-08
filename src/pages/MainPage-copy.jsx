import { Day } from '../components/Calendar/Day'
import { UseCalendarButtons } from '../hooks/UseCalendarButtons'
import { months, MONTHS_GENITIVE, TIME_OPTIONS } from '../general/constats'
import { SquareNoDay } from '../components/Squares/SquareNoDay'
import { SquareDayReady } from '../components/Squares/SquareDayReady'
import { SquareFull } from '../components/Squares/SquareFull'
import { useState } from 'react'
import { SvgClose } from '../assets/icons/SvgClose'
import { SvgNo } from '../assets/icons/SvgNo'

export const MainPage = () => {
  const [activeDay, setActiveDay] = useState(false)

  const today = new Date()
  const calendarButtons = UseCalendarButtons(today)
  
  const todayDay = today.getDate()
  const todayMonth = MONTHS_GENITIVE[today.getMonth()]
  
  return (
    <>
      <div className='container-form'>
        <h1>Записаться на студию</h1>
        <div className="calendarContainer">
          <div className='calendar'>
            {calendarButtons.map((week, weekIndex) => (
              <>
              <div className='week' key={weekIndex}>
                {week.map((button) => (
                  <div key={button.id} className={`calendar-button-wrapper wrapper-${button.status}`}>
                    <button className={`calendar-button ${button.status}`}>
                      {button.title}
                    </button>
                  </div>
                ))}
              </div>
              {weekIndex === 3 && ( // так я сделал что бы просто раскрыть блок с выбором времени 
                <div className='time-selection'>
                  <div className='hr-container'>
                    <hr />
                    <span className="gray-text">Выберите время!</span>
                    <hr />
                    <button><u>скрыть</u></button>
                  </div>
                  <div className="time-content">
                    {TIME_OPTIONS.map((time) => (
                      <div className={`time-btn-wrapper wrapper-${time.status}`} key={time.title}>
                        <div className={`time-btn ${time.status}`}>{time.title}</div>
                      </div>
                    ))}
                  </div>
                  <div className='hr-container hr-end'>
                    <hr />
                  </div>
                  
                </div>
              )}
              </>
            ))}
          </div>


          {/* ================= квадрат ================= */}
          <div onClick={() => setActiveDay(prev => !prev)} className="squares">
            <div className={`square ${activeDay ? 'full' : 'noday'}`}>
              <div className="header">
              {!activeDay && <span className="top-span gray-text">Сегодня</span>}
                <div className='accent-container'>
                  <span className="accent">{todayDay}</span>
                  <span className="month">{todayMonth}</span>
                </div>
                {activeDay && (
                  <>
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
                  </>
                )}
              </div>
              <div className="info-content gray-text">
                Общее время: 3 часа <br />Цена: 1500р
              </div>
              {activeDay && <button className="button inactive"><SvgNo /> Отмена</button>}
            </div>
            <div className="square months-wrapper px-6 py-4">
              <div className="months">
                {months.map((month) => (
                    <div className={`month ${month.status}`}>{month.title}</div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}