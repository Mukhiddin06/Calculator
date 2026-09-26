import { useState, useEffect } from "react"
import { keypad } from "./utilis"
import { useCalculatorStore } from './store'

const App = () => {
  const [currentValue, setCurrentValue] = useState('0')
  const [expression, setExpression] = useState('')
  const { history, addHistory, clearHistory } = useCalculatorStore()

  useEffect(() => {
  const handleKeyDown = (event: KeyboardEvent) => {
    const key = event.key

    if (/^[0-9.]$/.test(key)) {
      handleNumberPress(key)
    }

    if (['+', '-', '*', '/'].includes(key)) {
      handleOperatorPress(key)
    }

    if (key === 'Enter' || key === '=') {
      handleEqualsPress()
    }

    if (key === 'Backspace') {
      handleBackspacePress()
    }

    if (key === 'Escape') {
      setCurrentValue('0')
      setExpression('')
    }

    if (key === '%') {
      handlePercentPress()
    }
  }

  window.addEventListener('keydown', handleKeyDown)

  return () => {
    window.removeEventListener('keydown', handleKeyDown)
  }
}, [])

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
  setCurrentValue((prev) => {
    const parts = prev.split(' ')
    const lastPart = parts[parts.length - 1]

    if (['+', '-', '*', '/'].includes(lastPart)) {
      return prev
    }

    return `${prev} ${value}`
  })
}

const handleEqualsPress = () => {
  const parts = currentValue.split(' ')

  // 1. / va * amallarini bajarish
  for (let i = 1; i < parts.length; i += 2) {
    const operator = parts[i]

    if (operator === '/' || operator === '*') {
      const firstNumber = Number(parts[i - 1])
      const secondNumber = Number(parts[i + 1])

      let result = 0

      if (operator === '/') {
        result = firstNumber / secondNumber
      }

      if (operator === '*') {
        result = firstNumber * secondNumber
      }

      parts.splice(i - 1, 3, String(result))

      i -= 2
    }
  }

  // 2. - va + amallarini bajarish
  let result = Number(parts[0])

  for (let i = 1; i < parts.length; i += 2) {
    const operator = parts[i]
    const nextNumber = Number(parts[i + 1])

    if (operator === '-') {
      result -= nextNumber
    }

    if (operator === '+') {
      result += nextNumber
    }
  }

  setExpression(String(result))
  addHistory({
  expression: currentValue,
  result: String(result),
  })
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
            <button className="more-button" type="button" aria-label="Tarix menyusi" onClick={clearHistory}>
              X
            </button>
          </div>

          <div className="history-list">
  {history.map((item, index) => (
    <article className="history-item" key={index}>
      <p>{item.expression}</p>
      <strong>{item.result}</strong>
    </article>
  ))}
          </div>

          <p className="history-footnote">
  {history.length} ta hisoblash
</p>
        </aside>
      </section>
    </main>
  )
}

export default App
