import React from 'react'
import './Tooltip.css'

// Takes in 3 props
//content(required) what will read inside tooltip
//direction(top, down, left, or right) which direction tooltip will be shown defaults to top
//delay: how much time in milliseconds to show tooltip defaults to 400ms

const Tooltip = (props) => {
  return (
    <div
      className='Tooltip-Wrapper'
      // When to show the tooltip
    >
      {/* Wrapping */}
      {props.children}

      <div className={`Tooltip-Tip ${props.direction || 'top'}`}>
        {/* Content */}
        {props.content}
      </div>
    </div>
  )
}

export default Tooltip
