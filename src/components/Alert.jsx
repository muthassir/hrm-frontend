import React from 'react'

const Alert = ({error}) => {
  return (
   <div className="alert alert-error shadow-lg mb-4">
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728" />
                    </svg>
                    <span>{error}</span>
                  </div>
                </div>
  )
}

export default Alert