const chatInput = document.querySelector(".chat-input textarea");
const chatBox = document.querySelector(".chatbox");
const sendChatBtn = document.querySelector(".chat-input i");
const chatBotToggler = document.querySelector(".chatbox-toggler");
const chatBotCloseBtn = document.querySelector(".close-btn");


let userMsg;
const API_KEY = "key_here";
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" ?  `<p></p>` : `<i class="ri-robot-2-line"></i><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent =  message;
    return chatLi;
}


const generateResponce  = (incomingChatLi) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = incomingChatLi.querySelector("p");

    const requestOptions = {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        }, 
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: userMsg}]

        })
    }

    fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
        messageElement.textContent = data.choices[0].message.content;
    }).catch((error) => {
        messageElement.classList.add("error");
        messageElement.textContent = "oops! Something went wrong please try again";
    }).finally(() => chatBox.scrollTo(0, chatBox.scrollHeight));
}

const handleChat = () => {
    userMsg = chatInput.value.trim();
    if(!userMsg) return;
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;


    chatBox.appendChild(createChatLi(userMsg, "outgoing"));
    chatBox.scrollTo(0, chatBox.scrollHeight);

    setTimeout(() => {


        const incomingChatLi = createChatLi(".....", "incoming");
        chatBox.appendChild(incomingChatLi);
        chatBox.scrollTo(0, chatBox.scrollHeight);
        generateResponce(incomingChatLi);

    }, 300);
}


chatInput.addEventListener("input", () => {
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
})


chatInput.addEventListener("keydown", (e) => {
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800){
        e.preventDefault();
        handleChat();
    }
})


sendChatBtn.addEventListener("click", handleChat);
chatBotCloseBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatBotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));