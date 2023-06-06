import { useState } from 'react'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';

// const API_KEY = "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";
// "Explain things like you would to a 10 year old learning how to code."
const systemMessage = { //  Explain things like you're talking to a software professional with 5 years of experience.
  "role": "system", "content": "Explain things like you're talking to a software professional with 2 years of experience."
}

// OPENAI_API_KEY=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

function App() {
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm ChatGPT! Ask me anything!",
      sentTime: "just now",
      sender: "ChatGPT"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: 'outgoing',
      sender: "user"
    };

    const newMessages = [...messages, newMessage];
    
    setMessages(newMessages);

    // Initial system message to determine ChatGPT functionality
    // How it responds, how it talks, etc.
    setIsTyping(true);
    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages) { // messages is an array of messages
    // Format messages for chatGPT API
    // API is expecting objects in format of { role: "user" or "assistant", "content": "message here"}
    // So we need to reformat

    let apiMessages = chatMessages.map((messageObject) => {
      if (messageObject.sender === "ChatGPT") {
      } else {
      }
      return { role: role, content: messageObject.message}
    });


    // Get the request body set up with the model we plan to use
    // and the messages which we formatted above. We add a system message in the front to'
    // determine how we want chatGPT to act. 
    const apiRequestBody = {
      "model": "ada",
      "messages": [
        systemMessage,  // The system message DEFINES the logic of our chatGPT
        ...apiMessages // The messages from our chat with ChatGPT
      ]
    }


    const apiUrl = 'http://localhost:5000/query/';

    // Function to call the API
    const callApi = async (query) => {
      try {
        const response = await fetch(apiUrl + encodeURIComponent(query));
        const data = await response.json();
        return data.response;
      } catch (error) {
        console.error('Error:', error);
        return null;
      }
    };

    // Example usage
    // const query = apiMessages[apiMessages.length - 1].content;
    // console.log(apiMessages)
    // callApi(query)
    //   .then(response => {
    //     // Handle the response data
    //     setMessages([...chatMessages, {
    //       message: response.response.trim(),
    //       sender: "ChatGPT"
    //     }]);
    //     setIsTyping(false);
    //   })
    //   .catch(error => {
    //     console.error('API error:', error);
    //     // Handle the error
    //   });

    const query = apiMessages[apiMessages.length - 1].content;
    console.log(apiMessages)
    callApi(query)
      .then(response => {
        console.log(response)
        // Handle the response data
        setMessages([...chatMessages, {
          message: response.response,
          sender: "ChatGPT"
        }]);
        setIsTyping(false);
      })
      .catch(error => {
        console.error('API error:', error);
        // Handle the error
      });



    // await fetch("https://api.openai.com/v1/chat/completions", 
    // {
    //   method: "POST",
    //   headers: {
    //     "Authorization": "Bearer " + API_KEY,
    //     "Content-Type": "application/json"
    //   },
    //   body: JSON.stringify(apiRequestBody)
    // }).then((data) => {
    //   return data.json();
    // }).then((data) => {
    //   console.log(data);
    //   setMessages([...chatMessages, {
    //     message: data.choices[0].message.content,
    //     sender: "ChatGPT"
    //   }]);
    //   setIsTyping(false);
    // });
  }

  return (
    <div className="App">
      <div style={{ position:"relative", height: "800px", width: "700px"  }}>
        <MainContainer>
          <ChatContainer>       
            <MessageList 
              scrollBehavior="smooth" 
              typingIndicator={isTyping ? <TypingIndicator content="ChatGPT is typing" /> : null}
            >
              {messages.map((message, i) => {
                console.log(message)
                return <Message key={i} model={message} />
              })}
            </MessageList>
            <MessageInput placeholder="Type message here" onSend={handleSend} />        
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  )
}

export default App