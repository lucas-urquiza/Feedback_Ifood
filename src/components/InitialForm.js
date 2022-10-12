import React from "react"

const InitialForm = ({onSubmitForm, nameToFeedback, handleInputName, targetNameToFeedback, handleInputTargetName, feedbackType, setFeedbackType, setTargetNameToFeedback}) => {
    
    return (
    	<form className="form" onSubmit={onSubmitForm}>
            <input value={nameToFeedback} onChange={handleInputName} className="inputName" placeholder={`Digite seu nome ${feedbackType === 'minhaLideranca' ? '- opcional' : ``}`} title="Ao avaliar liderança é opcional" required={feedbackType === "autoAvaliacao"} maxLength={40} type="text"/>
            <input value={targetNameToFeedback} disabled={feedbackType === "autoAvaliacao"} onChange={handleInputTargetName} className="inputName" placeholder="Digite o e-mail de quem será avaliado" required={feedbackType !== 'autoAvaliacao'}  maxLength={40} type="email" />
            
            <div className="type_avaliation_box">
                <label className="inputContainer">Auto Avaliação
                    <input type="radio" required name="avaliationType" checked={feedbackType === "autoAvaliacao"} value="autoAvaliacao" onChange={ (e) => {

                        setFeedbackType(e.target.value)
                        setTargetNameToFeedback(nameToFeedback)
                    }} />
                    <span className="checkmark"></span>
                </label>

                <label className="inputContainer">Avaliando minha liderança
                    <input type="radio" name="avaliationType" checked={feedbackType === "minhaLideranca"} value="minhaLideranca" onChange={ (e) => {
                        setFeedbackType(e.target.value)
                    }} />
                    <span className="checkmark"></span>
                </label>
            
                <label className="inputContainer">Avaliando meu time
                    <input type="radio" name="avaliationType" checked={feedbackType === "meuTime"} value="meuTime" onChange={ (e) => setFeedbackType(e.target.value)}/>
                    <span className="checkmark"></span>
                </label>
            </div>

            <button type="submit" className="startButton">Iniciar</button>
        </form>
    )
}

export default InitialForm