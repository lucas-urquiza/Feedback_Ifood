import React from "react"
import { CUIDADOR_EXPLICACAO, DESAFIADOR_EXPLICACAO, SEGURA_EXPLICACAO } from '../constants'

const ResultExplanation = ({result}) => {
  if(result > 0){
    return <span>
      {DESAFIADOR_EXPLICACAO}
      <br/>
      Recomendamos que você realize o teste a cada 2 meses.
      </span>
  }
  
  if(result < 0){
     return <span>
      {CUIDADOR_EXPLICACAO}
      <br/>
      Recomendamos que você realize o teste a cada 2 meses.
      </span>
  }

     return <span>
      {SEGURA_EXPLICACAO}
      <br/>
      Recomendamos que você realize o teste a cada 2 meses.
      </span>

}


export default ResultExplanation