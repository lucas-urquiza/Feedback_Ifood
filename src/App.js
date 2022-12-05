  import Swal from 'sweetalert2'
  import withReactContent from 'sweetalert2-react-content'
  import { useEffect, useState } from "react";
  import { QUESTIONS } from './constants'
  import retangulo from './imgs/retangulo.svg';
  import base from './imgs/base.svg';
  import InitialForm from "./components/InitialForm";
  import ResultExplanation from "./components/ResultExplanation";
  import ResultText from "./components/ResultText";
  import "./index.css";

  import { collection, addDoc, getFirestore } from "firebase/firestore";
  import {firebaseConfig} from './firebaseConfig'
  import { initializeApp } from 'firebase/app';

  initializeApp(firebaseConfig)
  const database = getFirestore()

  const AlertError = withReactContent(Swal)

  export default function App() {
    const [nameToFeedback, setNameToFeedback] = useState('')
    const [feedbackType, setFeedbackType] = useState('')
    const [targetNameToFeedback, setTargetNameToFeedback] = useState('')
    const [answers, setAnswers] = useState({})
    const [numPerguntas, setNumPerguntas] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [peso, setPeso] = useState([0, 0]);
    const [canStart, setCanStart] = useState(true)
    const [angulo, setAngulo] = useState(0);

    const resetFeedbackState = () => {
      setNameToFeedback('')
      setFeedbackType('')
      setTargetNameToFeedback('')
      setAnswers({})
      setNumPerguntas(0)
      setShowResult(false)
      setPeso([0,0])
      setCanStart(true)
      setAngulo(0)
    }

    const handleInputName = (e) => {setNameToFeedback(e.target.value)}
    const handleInputTargetName = (e) => {setTargetNameToFeedback(e.target.value)}

    const onSubmitOnboardingForm = (e) => {
      e.preventDefault();
      setCanStart(false);
    }

    const responder = (value) => {
      setAnswers(prevAnswers => {
        const numeroPergunta = numPerguntas + 1;
        var label = `Pergunta${numeroPergunta}`
        return {...prevAnswers, [label]: value}
      })

      const actualType = QUESTIONS[numPerguntas].type;
      const valorDireita = actualType === "desafiador" ? value : 0;
      const valorEsquerda = actualType === "desafiador" ? 0 : value;

      setPeso((prevPeso) => {
        const newPesoDireita = prevPeso[1] + valorDireita;
        const newPesoEsquerda = prevPeso[0] + valorEsquerda;
        return [newPesoEsquerda, newPesoDireita];
      });

      
      if (numPerguntas >= QUESTIONS.length - 1) {
        setShowResult(true);
        return;
      }
      
      setNumPerguntas((p) => p + 1);
    };


    const submitResult = async () => {

      const CalcularResultado = () => {
     
        if(peso[0] <= 12 && peso[1] <= 12){
          return "Pontuação abaixo para as duas caracteristicas"
        }
        if(peso[0] <= 12 && peso[1] > 12){
          return "Desafiador"
        }
        if (peso[0] > 12 && peso[1] <= 12) {
          return "Conforto"
        }

        if(peso[0] > 12 && peso[1] > 12){
          if((peso[0] > peso[1]) && ((peso[0] - peso[1]) >= 2) ){
            return "Conforto"
          } else  if((peso[1] > peso[0]) && ((peso[1] - peso[0]) >= 2) ){
            return "Desafiador"
          } else {
            return "Liderança Segura"
          }
        }
    
      }

      const feedbackInformations = {
        avaliado: targetNameToFeedback,
        tipoDeAvaliacao: feedbackType,
        respostas: answers,
        dataAvaliacao: new Date().toLocaleString('pt-br'),
        pesoConforto: peso[0],
        pesoDesafiador: peso[1],
        resultado: CalcularResultado()
      }
      console.log(feedbackInformations)
      try{
        // Caso necessário alterar o banco de dados, pode alterar as linhas abaixo, enviando o objeto de feedbackInformations para o novo endpoint
        const collectionRef = collection(database, 'feedbacks');
        await addDoc(collectionRef, feedbackInformations);
      }catch(e) {
        console.log("Erro ao enviar feedback documento", e)
      }
    }

    useEffect(() => {
      if(showResult) {
        const repeatedAnswers = Object.values(answers).every(resposta => resposta == 0);
        const lowValueToAnswers = peso[0] <= 12 && peso[1] <= 12;

        if(repeatedAnswers){
          AlertError.fire({
            icon: 'error',
            title: 'Feedback não enviado!',
            text: 'Refaça o teste com respostas adequadas.',
          })
          resetFeedbackState()
          return;
        }

        if(lowValueToAnswers){
          setAngulo(`0`); // Mostra como liderança segura e com o texto para buscar mais conhecimento. 
        }

         if(peso[0] <= 12 && peso[1] > 12){
          setAngulo(`15`); // muito desafio
        }
        
        if (peso[0] > 12 && peso[1] <= 12) {
          setAngulo(`-15`); // muito conforto
        }


        if(peso[0] > 12 && peso[1] > 12){
          if((peso[0] > peso[1]) && ((peso[0] - peso[1]) >= 2) ){
             setAngulo(`-15`); // muito conforto
          } else if((peso[1] > peso[0]) && ((peso[1] - peso[0]) >= 2) ){
            setAngulo(`15`); // muito desafio
          } else {
            setAngulo(`0`); // Lider 
          }
        }
        
        AlertError.fire({
          icon: 'success',
          title: 'Obrigado foodlover!',
          text: `Avaliação de ${targetNameToFeedback} enviada com sucesso`,
        })

        
        submitResult()
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[showResult])

    const mostrarQuestionario = !showResult && !canStart;

    return (
      <main className={showResult ? 'wrapperReverse': `wrapper`}>

        {/* Lado Esquerdo */}
        <div className="infoBox">
          {canStart ? ( <h1>Olá foodLover, digite o e-mail de quem você deseja avaliar</h1>) : (
            <h1 className="hideOnMobile">
              Como o(a) foodLover avaliado(a) está desenvolvendo novos(as) líderes?
            </h1>
          ) }
        
     
          {!showResult && canStart && (
            <>
              
              <InitialForm
                onSubmitForm={onSubmitOnboardingForm} nameToFeedback={nameToFeedback} handleInputName={handleInputName} targetNameToFeedback={targetNameToFeedback} handleInputTargetName={handleInputTargetName}
                feedbackType={feedbackType}
                setFeedbackType={setFeedbackType}
                setTargetNameToFeedback={setTargetNameToFeedback}
                />
                <p>Responda as perguntas de 1 a 5 indicando o quanto você concorda com cada uma das respostas</p>
            
            </>
            )}

          {!canStart && (
            <div className="balance">
              {showResult && (
                <div className="answer__text">
                  <ResultText result={angulo} />
                </div>
              )}

              <div  style={!!showResult ? { transform: `rotate(${angulo}deg)`} : {}} className="balance__retangle">
                <img width="100%" src={retangulo} alt=""></img>
              </div>

              <div className="balance__base">
                <img width="90%" src={base} alt=""></img>
                {showResult && (
                  <>
                    <span className="text__left">CUIDAR</span>
                    <span className="text__right">DESAFIAR</span>
                  </>
                )}
              </div>
            </div>
          )}  
        </div>

        
        {/* Resultado*/}
          {showResult && (
            <div className="questionBox">
              <div className="questionBox__wrapper">
                <h2 className="resultTitle">
                    {feedbackType === "autoAvaliacao" ? (
                    <>
                      <span className="question__number">Resultado da avaliação:</span>
                      <span className="questionTitle__initialText">
                        {peso[0] > 12 && peso[1] > 12  && (
                          <>
                            <ResultExplanation result={angulo} />
                            <br/>
                            <br/>
                          </>
                        )}

                      
                        {peso[0] <= 12 && peso[1] <= 12 ? (
                        <>
                          Líder, sua pontuação foi abaixo da nossa média mínima para Liderança Segura.
                          <br/>
                          Para alimentar mais a sua fome, <a className='resultLink' href="https://docs.google.com/forms/d/1ilbMHM1d58kjtcHUxn7yiuRLc4sQmJR5bEhsUKhtwfU" target="_blank" rel="noreferrer">clique aqui </a>e saiba quais são <br/> as habilidades de uma Liderança Segura que você precisa desenvolver.
                        </>) : (

                        <>
                          Agora que você já sabe em qual aspecto você está (cuidar, desafiar ou liderança segura), que tal saber mais sobre qual das 09 características de uma Liderança Seguro você pode desenvolver ?
                        
                          <br/>

                          Preencha o <a className='resultLink' href="https://docs.google.com/forms/d/1ilbMHM1d58kjtcHUxn7yiuRLc4sQmJR5bEhsUKhtwfU" target="_blank" rel="noreferrer">formulário.</a>
                        </>
                        ) }

                      
                      
                      </span>
                    </>
                    ) : (
                      <>
                      <span className="question__number">Foodlover,</span>
                      <span className="questionTitle__initialText">
                        Sua avaliação foi enviada para nossa base de dados. Obrigado!   
                        <br/>
                        <br/>
                        Recomendamos que você realize o teste a cada 2 meses. 
                      </span>
                      </> 
                    )}

                </h2>
                <button className="restartButton" onClick={()=> resetFeedbackState()}>Fazer nova avaliação</button>

    

      
              </div>
            </div>
          )}

          {/* Lado Direto com Questionario */}
          {mostrarQuestionario && (
            <div className="questionBox">
              <h2 className="questionTitle">
              <span className="question__number">Pergunta {numPerguntas + 1} de {QUESTIONS.length}</span>
                <span className="questionTitle__initialText">Quanto você concorda com a afirmação...</span>
                {QUESTIONS[numPerguntas]?.title}
              </h2>

              <div className="answerBox">
                <button onClick={() => responder(1)}>1</button>
                <button onClick={() => responder(2)}>2</button>
                <button onClick={() => responder(3)}>3</button>
                <button onClick={() => responder(4)}>4</button>
                <button onClick={() => responder(5)}>5</button>
              </div>

              <div className="answerHint">*O valor 1 representa pouca expressividade e o valor 5 representa grande consistência.</div>
            </div>
          )}

      </main>
    );
  }
