import React, { useState, useRef } from 'react'
import { FileUploader } from "react-drag-drop-files";
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';
import { saveAs } from 'file-saver';


// "Explain things like you would to a 10 year old learning how to code."
const systemMessage = { //  Explain things like you're talking to a software professional with 5 years of experience.
  "role": "system", "content": "Explain things like you're talking to a software professional with 2 years of experience."
}
const fileTypes = ["TXT", "PDF", "JSX", "CSS"];

function App() {
  const selectedFile = useRef();
	const [isFilePicked, setIsFilePicked] = useState(false);
  const [isSelected, setIsSelected] = useState(false)

  const changeHandler = (event) => {
    console.log(event)
    selectedFile.current = event.target.files[0];
    console.log(event.target.files[0])
    console.log(selectedFile.current)
		setIsSelected(true);
  };

  const handleSubmission = () => {
    const formData = new FormData()
    formData.append('file', selectedFile.current)
    console.log(formData)

    fetch(
			'http://localhost:5000/upload',
			{
				method: 'POST',
				body: formData,
			}
		)
			.then((result) => {
				console.log('Success:', result);
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	};

  const clearFiles = () => {

    fetch(
			'http://localhost:5000/delete',
			{
				method: 'POST',
			}
		)
	};

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
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
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

    const query = apiMessages[apiMessages.length - 1].content;
    console.log(apiMessages)
    callApi(query)
      .then(response => {
        console.log(response)
        // Handle the response data
        setMessages([...chatMessages, {
          message: response.response.trim(),
          sender: "ChatGPT"
        }]);
        setIsTyping(false);
      })
      .catch(error => {
        console.error('API error:', error);
        // Handle the error
      });
  }

  return (
    <div className="App">
      <div style={{ position:"relative", height: "800px", width: "700px" }}>
      <div>
        <input type="file" name="file" onChange={changeHandler} />
        {isSelected ? (
				<div>
					<p>Filename: {selectedFile.current.name}</p>
					<p>Filetype: {selectedFile.current.type}</p>
					<p>Size in bytes: {selectedFile.current.size}</p>
					<p>
						lastModifiedDate:{' '}
						{selectedFile.current.lastModifiedDate.toLocaleDateString()}
					</p>
				</div>
			) : (
				<p>Select a file to show details</p>
			)}
        <div>
          <button onClick={handleSubmission}>Load</button>
          <button onClick={clearFiles}>Clear Files</button>
        </div>
		  </div>
        <MainContainer>
          <ChatContainer>
            <MessageList 
              scrollBehavior="smooth" 
              typingIndicator={isTyping ? <TypingIndicator content="ChatGPT is typing" /> : null}
            >
              {messages.map((message, i) => (
                <Message key={i} model={message} />
              ))}
            </MessageList>
            <MessageInput placeholder="Type message here" onSend={handleSend} />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
}

export default App
