import React from 'react'

const Notification = ({ success, error }) => {
  if (error) {
    return (
      <div className="notification-error">
        {error}
      </div>
    )
  }
  if (success) {
    return (
      <div className="notification-success">
        {success}
      </div>
    )
  }

  return null
}

export default Notification
