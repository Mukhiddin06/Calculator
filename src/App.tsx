import { useState } from "react"
import { keypad } from "./utilis"

const App = () => {
  const [currentValue, setCurrentValue] = useState('0')
  const [expression, setExpression] = useState('')

const handleNumberPress = (value: string) => {
  setCurrentValue((prev) => {
    const parts = prev.split(' ')
    const lastPart = parts[parts.length - 1]

    if (value === '.' && lastPart.includes('.')) {
      return prev
    }

    if (value === '.') {
      return lastPart === '' ? prev + '0.' : prev + value
    }

    if (['+', '-', '*', '/'].includes(lastPart)) {
      return `${prev} ${value}`
    }

    return lastPart === '0'
      ? prev.slice(0, -1) + value
      : prev + value
  })
}

const handleOperatorPress = (value: string) => {
  setCurrentValue(`${currentValue} ${value}`)
}

const handleEqualsPress = () => {
  const parts = currentValue.split(' ')

  const firstNumber = Number(parts[0])
  const operator = parts[1]
  const secondNumber = Number(parts[2])

  let result = 0

  if (operator === '+') {
    result = firstNumber + secondNumber
  }

  if (operator === '-') {
    result = firstNumber - secondNumber
  }

  if (operator === '*') {
    result = firstNumber * secondNumber
  }

  if (operator === '/') {
    result = firstNumber / secondNumber
  }

  setExpression(String(result))
}

const handleBackspacePress = () => {
  setCurrentValue((prev) => {
    if (prev === '0') {
      return prev
    }
    
    const newValue = prev.slice(0, -1)

    if (newValue.endsWith(' ')) {
      return newValue.slice(0, -1)
    }

    return newValue || '0'
  })
}

const handlePercentPress = () => {
  setCurrentValue((prev) => {
    const parts = prev.split(' ')
    const lastPart = parts[parts.length - 1]

    if (!lastPart || ['+', '-', '*', '/'].includes(lastPart)) {
      return prev
    }

    const percent = Number(lastPart) / 100

    return [...parts.slice(0, -1), String(percent)].join(' ')
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
            <p className="result">{expression}</p>
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
                  // console.log(key.label, key.tone)
                  if (key.tone === 'number') {
                    handleNumberPress(key.label)
                  }
                  if (key.tone === 'operator') {
                    handleOperatorPress(key.label)
                  }
                  if (key.tone === 'equals') {
                    handleEqualsPress()
                  }
                  if (key.tone === 'utility') {
                    if (key.label === 'AC') {
                      setCurrentValue('0')
                      setExpression('')
                    }
                    if (key.label === '⌫') {
                      handleBackspacePress()
                    }
                    if (key.label === '%') {
                      handlePercentPress()
                    }
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
