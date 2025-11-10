import React from 'react'

const Card = (props) => {
  const paddingClass = props.padding ? 'p-1' : 'p-3'
  return (
    <div className={`w-full h-[100%] flex flex-col border-1 border-gray-300 bg-white rounded-md shadow-sm ${paddingClass}`}>
      {props.children}
    </div>
  )
}

export default Card
