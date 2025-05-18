const chatInput = 
    document.querySelector('.chat-input textarea');
chatInput.addEventListener("focus", () => {
    setTimeout(()=>{
        window.scrollTo(0,0);
    }, 100)
})
if (window.visualViewport) {
  window.visualViewport.addEventListener("resize", () => {
    const chatInputContainer = document.querySelector(".chatbox");
    const viewportHeight = window.visualViewport.height;
    chatInputContainer.style.bottom = `${window.innerHeight - viewportHeight}px`;
  });
}

const sendChatBtn = 
    document.querySelector('.chat-input button');
const chatbox = document.querySelector(".chatbox");

let userMessage;
const API_KEY = 
    "tgp_v1_MQ2adXCZV21rs4UY5zIylzdzQeUB3gc6Bzf75bwPYkw";

const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent;
    if (className === "chat-outgoing") {
        classContent = `<p class ="outgoing-message">${message}</p>`;
 } else {
        chatContent =  `<p class= "incoming-message">${message}</p>`;
    }
    chatLi.innerHTML = chatContent;
    return chatLi;
}

const generateResponse = (incomingChatLi) => {
    const API_URL = "https://api.together.xyz/v1/chat/completions";
    const messageElement = incomingChatLi
    .querySelector("p");
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            "model": "meta-llama/Llama-3.3-70B-Instruct-Turbo",
            "messages": [
                {
                    role: "user",
                    content: "Beantwoord dit in maximaal 200 woorden" + userMessage
                }
            ],
        })
    };

    fetch(API_URL, requestOptions)
        .then(res => {
            if (!res.ok) {
                throw new Error("Network response was not ok");
            }
            return res.json();
        })

        .then(data => {
            const responseText = data.choices[0].message.content;
            messageElement.textContent = responseText;

            const utterance = new SpeechSynthesisUtterance(responseText);
            utterance.lang = 'nl-NL'; // Or 'en-US' for English
            speechSynthesis.speak(utterance);

            incomingChatLi.scrollIntoView({ behavior: "smooth", block: "end" });

            // 1. Estimate reading time
            //const wordCount = responseText.split(/\s+/).length;
            //const wordsPerMinute = 244;
            //const readingTimeMs = (wordCount / wordsPerMinute) * 60 * 1000;

            // 2. Randomize eye movement during reading
           // const randomInterval = setInterval(() => {
            //    const randomChoice = Math.random() < 0.5 ? neutral_frames : thinking_frames;
            //    setEyeAnimation(randomChoice);
           // }, 2500); // switch every 2.5s during reading

            // 3. At the end of reading, go back to neutral and stop random eyes
           // setTimeout(() => {
           //     clearInterval(randomInterval);
           //     setEyeAnimation(neutral_frames);
           // }, readingTimeMs);
        })

        .catch((error) => {
            messageElement
            .classList.add("error");
            messageElement
            .textContent = "Oops! Something went wrong. Please try again!";
        })
        .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
};


const handleChat = () => {
    userMessage = chatInput.value.trim();

    if (!userMessage) {
        return;
    }
    chatbox
    .appendChild(createChatLi(userMessage, "chat-outgoing"));
    chatbox
    .scrollTo(0, chatbox.scrollHeight);

    if (userMessage.toLowerCase()==="bye"){
        cancel();
        return;
    }

    setTimeout(() => {
        setEyeAnimation(thinking_frames);

        const incomingChatLi = createChatLi("Thinking...", "chat-incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);

        setTimeout(() => {
            setEyeAnimation(neutral_frames);
        }, 1000);
    }, 1000);
};

sendChatBtn.addEventListener("click", handleChat);

const neutral_frames = [
    { src: "Assets/eyes_open.png", duration: 1800 },
    { src: "Assets/eyes_half_closed.png", duration: 100 },
    { src: "Assets/eyes_closed.png", duration: 300 },
    { src: "Assets/eyes_half_closed.png", duration: 100 }
  ];

const thinking_frames = [
    { src: "Assets/eyes_LU1.png", duration: 1800 },
    { src: "Assets/eyes_half_closed.png", duration: 100 },
    { src: "Assets/eyes_closed.png", duration: 300 },
    { src: "Assets/eyes_half_closed.png", duration: 100 }
]
  
  let current = 0;
  let currentFrames = neutral_frames;
  let animationTimeout;
  //const imgElement = document.getElementById("displayed-image");
  
  function showNextImage() {
    const frame = currentFrames[current];
    document.getElementById("displayed-image").src = frame.src;
  
    current = (current + 1) % currentFrames.length;
    //setTimeout(showNextImage, frame.duration);
    animationTimeout = setTimeout(showNextImage, frame.duration);
  }

  function setEyeAnimation(frames) {
    clearTimeout(animationTimeout);
    currentFrames = frames;
    current = 0;
    showNextImage();
  }
  
  window.onload = () => {
    setEyeAnimation(neutral_frames);
  };