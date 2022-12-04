import React from "react"

const InitialForm = ({onSubmitForm, targetNameToFeedback, handleInputTargetName, feedbackType, setFeedbackType}) => {
    
    return (
    	<form className="form" onSubmit={onSubmitForm}>
            <input value={targetNameToFeedback} onChange={handleInputTargetName} className="inputName" placeholder="E-mail de quem será avaliado" required={true}  maxLength={40} type="email" />
            
            <div className="type_avaliation_box">
                <label className="inputContainer">Auto Avaliação
                    <input type="radio" required name="avaliationType" checked={feedbackType === "autoAvaliacao"} value="autoAvaliacao" onChange={ (e) => {
                        setFeedbackType(e.target.value)
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