import React from 'react'

function Btn(Props) {
  return (
    <>
        <div className='border-2 border-gray-900 h-max'>
        <div className='btn'>{Props.text}</div></div>
    </>
  )
}

export default Btn