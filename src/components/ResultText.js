import React from 'react'

const ResultText = ({result}) => {

  if(result > 0){
    return (
      <div className="answer__ballon answer--ansiedade">Muita Ansiedade</div>
    )
  }
  
  if(result < 0){
    return (
      <div className="answer__ballon answer--conforto">Muito conforto</div>
    )
  }

  return <div className="answer__ballon answer--ideal">Liderança Segura</div>

}

export default ResultText