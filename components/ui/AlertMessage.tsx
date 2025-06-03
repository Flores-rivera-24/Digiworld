import React from 'react'

interface AlertMessageProps {
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  onClose?: () => void
}

const alertStyles = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800'
}

const iconStyles = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ'
}

export function AlertMessage({ type, message, onClose }: AlertMessageProps) {
  return (
    <div className={`border-l-4 p-4 rounded-md ${alertStyles[type]} relative`}>
      <div className="flex items-center">
        <span className="mr-2 font-bold">{iconStyles[type]}</span>
        <p className="text-sm font-medium">{message}</p>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto text-lg font-bold hover:opacity-70"
            aria-label="Cerrar alerta"
          >
            ×
          </button>
        )}
      </div>
    </div>
  )
}