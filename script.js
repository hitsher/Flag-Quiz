const searchLink = "https://restcountries.eu/rest/v2/all";
httpRequestAsync(searchLink);

let flag = document.getElementById("flag");
let answers = document.getElementById("answers");
let roundDiv = document.getElementById("round");
let scoreDiv = document.getElementById("score");
let resultDiv = document.getElementById("result");
let score = 0;
let round = 0;
let lock = false;

function theResponse(jsonObject) {
    lock = false;
    roundDiv.innerHTML="Round: "+ round+"/10";
    resultDiv.innerText='';
    answers.innerHTML = '';
    let i = Math.floor(Math.random() * jsonObject.length);
    let currentCountry = jsonObject[i];
    jsonObject.splice(i,1);
    let correctAnswer = currentCountry.name;
    flag.innerHTML = "<img src='" + currentCountry.flag + "'>";
    button = document.createElement('button');
    button.classList.add('answer');
    button.innerHTML = currentCountry.name;
    button.setAttribute("id", "answer0");
    button.setAttribute("value", currentCountry.name);
    answers.appendChild(button);

    for (let j = 0; j < 3; j++) {
        let k = Math.floor(Math.random() * jsonObject.length);
        let currentCountry = jsonObject[k];
        button = document.createElement('button');
        button.classList.add('answer');
        button.innerHTML = currentCountry.name;
        button.setAttribute("id", "answer" + (j + 1));
        button.setAttribute("value", currentCountry.name);
        answers.appendChild(button);
        jsonObject.splice(k,1);
    }

    let answer0_order = Math.floor(Math.random() * 100);
    let nswer1_order = Math.floor(Math.random() * 100);
    let nswer2_order = Math.floor(Math.random() * 100);
    let nswer3_order = Math.floor(Math.random() * 100);
    document.getElementById("answer0").style.order = answer0_order;
    document.getElementById("answer1").style.order = nswer1_order;
    document.getElementById("answer2").style.order = nswer2_order;
    document.getElementById("answer3").style.order = nswer3_order;
    scoreDiv.innerHTML="Score: "+score;

    let buttons = document.getElementsByClassName('answer');
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", function (e) {
            if (e.target.value == correctAnswer && lock == false) {
                lock = true;
                e.target.classList.add('green');
                setTimeout(function(){httpRequestAsync(searchLink); }, 1000);
                score++;
                round++;
                scoreDiv.innerHTML="Score: "+score;
                roundDiv.innerHTML="Round: "+round+"/10";
            } else if (e.target.value != correctAnswer && lock == false) {
                lock = true;
                e.target.classList.add('red');
                setTimeout(function(){httpRequestAsync(searchLink); }, 1000);
                round++;
                document.getElementById("answer0").classList.add('green');
                roundDiv.innerHTML="Round: "+round+"/10";
            }
        }, false);
    }
   
    if (round==10){
        resultDiv.innerText=('Game over! Your score: '+ score);
        flag.innerText='';
        answers.innerText='';
        roundDiv.innerText='';
        scoreDiv.innerText='';
        score = 0;
        round = 0;
        button = document.createElement('button');
        button.classList.add('again');
        button.innerHTML = "Play again";
        resultDiv.appendChild(button);
        let again = document.getElementsByClassName('again');
        again[0].addEventListener('click', function () {
            resultDiv.innerHTML='';
            httpRequestAsync(searchLink)
        })
    }
}

function httpRequestAsync(url) {
    let httpRequest = new XMLHttpRequest();
    httpRequest.open("GET", url, true);
    httpRequest.addEventListener('readystatechange', function () {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            let jsonObject = JSON.parse(httpRequest.responseText);
            theResponse(jsonObject);
        };
    });

    httpRequest.send();
}