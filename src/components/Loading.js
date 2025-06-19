import React from 'react'
import '../styles/components/Loading.scss'

const Loading = ({ size = 2 }) => {
  return (
    <div className={`loading`}>
      <div className='loading__dot' style={{ height: `${size}rem`, width: `${size}rem` }}></div>
      <div className='loading__dot' style={{ height: `${size}rem`, width: `${size}rem` }}></div>
      <div className='loading__dot' style={{ height: `${size}rem`, width: `${size}rem` }}></div>
    </div>
  )
}

export default Loading