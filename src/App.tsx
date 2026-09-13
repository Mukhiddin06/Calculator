import { useState } from "react"
import { keypad } from "./utilis"

const App = () => {
  const [currentValue, setCurrentValue] = useState('0')
  const [expression, setExpression] = useState('')

  const handleNumberPress = (value: string) => {
    setCurrentValue((prev) => {
    if (value === '.' && prev.includes('.')) {
      return prev
    }

    if (value === '.') {
      return prev + value
    }

    return prev === '0' ? value : prev + value
  })
  }

  return (
    <main className="workspace">
      <section className="calculator" aria-label="Kalkulyator interfeysi">
        <div className="calculator-main">
          <header className="calculator-header">
            <div className="brand">
              <span className="brand-mark" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
              </span>
              <span>Kalkulyator</span>
            </div>
            <span className="mode-label">BASIC</span>
          </header>

          <div className="display" aria-live="polite">
            <p className="result">{
            expression}</p>
            <p className="expression">{currentValue}</p>
          </div>

          <div className="keypad" aria-label="Kalkulyator tugmalari">
            {keypad.map((key) => (
              <button
                className={`key ${key.tone}`}
                key={key.label}
                type="button"
                dangerouslySetInnerHTML={{ __html: key.label }}
                onClick={() => {
                  console.log(key.label, key.tone)
                  if (key.tone === 'number') {
                    handleNumberPress(key.label)
                  }
                }}
              />
            ))}
          </div>
        </div>

        <aside className="history" aria-label="Oxirgi hisoblar">
          <div className="history-header">
            <div>
              <p className="eyebrow">BUGUN</p>
              <h1>Oxirgi hisoblar</h1>
            </div>
            <button className="more-button" type="button" aria-label="Tarix menyusi">
              <span />
              <span />
              <span />
            </button>
          </div>

          <div className="history-list">
            <article className="history-item active">
              <p>720 &divide; 9 + 14</p>
              <strong>94</strong>
            </article>
            <article className="history-item">
              <p>1 280 &times; 8</p>
              <strong>10 240</strong>
            </article>
            <article className="history-item">
              <p>8 700 - 2 345</p>
              <strong>6 355</strong>
            </article>
          </div>

          <p className="history-footnote">3 ta hisoblash</p>
        </aside>
      </section>
    </main>
  )
}

export default App
