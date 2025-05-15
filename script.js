const chatInput = 
    document.querySelector('.chat-input textarea');
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

//Select the API with the correct chatbot model
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
                    content: userMessage
                }
            ]
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
            messageElement
            .textContent = data.choices[0].message.content;
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
    { src: "Assets/eyes_LU1.png", duration: 2500 },
    { src: "Assets/eyes_half_closed.png", duration: 100 },
    { src: "Assets/eyes_closed.png", duration: 300 },
    { src: "Assets/eyes_half_closed.png", duration: 100 }
  ];

const thinking_frames = [
    { src: "Assets/eyes_LU1.png", duration: 2500 },
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