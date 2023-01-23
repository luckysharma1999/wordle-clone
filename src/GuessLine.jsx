import React from 'react';
import './index.css';
function GuessLine({ guess, solution, isFinal }) {
    
    
return (
    <div className="line">
    {   
        guess.split('').map((char,i)=>{
        let className = "tile";

        if(isFinal){
        if(char === solution[i]){
            className += " correct";
        }else if(solution.includes(char)){
            className += " close";
        }else{
            className += " incorrect";
        }
        }
            return <div key={i} className={className}>{char}</div>
    })
        }
        
    </div>
);
}



export default GuessLine;