let numberOfQuestions = 0;

document.querySelector("#addNewQuestion").addEventListener("click", function(){
    numberOfQuestions++;

    let question_div = document.createElement("div");
    question_div.classList.add('form-group');

    let questionId = "question" + numberOfQuestions;
    let option1Id = questionId + "_option1";
    let option2Id = questionId + "_option2";
    let option3Id = questionId + "_option3";
    let option4Id = questionId + "_option4";
    let correctAnswerId = questionId + "_ca";
    
    question_div.innerHTML = 
    "<label for='" + questionId + "'>Question " + numberOfQuestions +"</label><br>"
    +
    "<textarea name='" + questionId + "' id='" + questionId + "' cols='200' rows='3'></textarea><br>"
    +
    "<label for='" + option1Id + "'>A</label><br>"
    +
    "<textarea name='" + option1Id + "' id='" + option1Id + "' cols='200' rows='2'></textarea><br>"
    +
    "<label for='" + option2Id + "'>B</label><br>"
    +
    "<textarea name='" + option2Id + "' id='" + option2Id + "' cols='200' rows='2'></textarea><br>"
    +
    "<label for='" + option3Id + "'>C</label><br>"
    +
    "<textarea name='" + option3Id + "' id='" + option3Id + "' cols='200' rows='2'></textarea><br>"
    +
    "<label for='" + option4Id + "'>D</label><br>"
    +
    "<textarea name='" + option4Id + "' id='" + option4Id + "' cols='200' rows='2'></textarea><br>"
    +
    "<label for='" + correctAnswerId + "'>Correct Option</label><br>"
    +
    "<input type='text' name='" + correctAnswerId + "' id='" + correctAnswerId + "'>";

    document.querySelector(".examForm").insertBefore(question_div, document.querySelector(".storeExam"));
    // document.querySelector("body").appendChild(question_div);
});