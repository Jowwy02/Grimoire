import { useState, useEffect, useRef } from "react";
import OpenAI from "openai";
import React from "react";
import CommentInfo from "./assets/CommentInfo.svg";
import Logo from "./assets/Logo .svg";

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_KEY,
  dangerouslyAllowBrowser: true,
});

const PROMPT = {
  role: "system",
  content:
    "Create a very short fictional story using HTML tag format without the <doctype> and <html> tags. The story should be based on the theme chosen by the user.  The story should be structured into chapters. Each response from the model should be a new chapter. The chapters title should be a bold. The first chapter should have a title that carries the name of the story. The rest of the chapter should be structured with semantic tags to get a good readable structure. It should return the first chapter only first, then when users raises a prompt, it should return the next chapter and so on in that manner. The chapters shouldn't be cut abruptly, avoid this. After each chapter, suggest directions that the story can go. The directions should be titled by paths and be bold.",
};

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isThinking, setIsThinking] = useState(false);

  const messagesEndRef = useRef(null);

  console.log(messages);

  const callOpenaiAPI = async (chat) => {
    // setMessages([...messages, { role: "system", content: input }]);
    setInput("");
    console.log("chat", chat);
    console.log("messages", messages);
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-0613",
        messages: chat,
        max_tokens: 300,
        temperature: 0,
      });

      setMessages((prev) => [...prev, completion.choices[0].message]);
      setIsThinking(false);
    } catch (error) {
      setIsThinking(false);
      if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
      } else {
        console.log(error.message);
      }
    }
  };

  const onSubmitAction = () => {
    if (!input) return;
    console.log("input", input);
    setIsThinking(true);
    setMessages([...messages, { role: "user", content: input }]);
    console.log("messages", messages);
    scrollToBottom();
    callOpenaiAPI([PROMPT, ...messages, { role: "user", content: input }]);
  };

  const selectOption = (option) => {
    // setInput(option)
    setIsThinking(true);
    setMessages([...messages, { role: "user", content: option }]);
    callOpenaiAPI([PROMPT, ...messages, { role: "user", content: option }]);
  };

  const preloadSVG = (
    <>
      <svg
        className="inline w-8 h-8 mr-2 text-white animate-spin fill-blue-600"
        aria-hidden="true"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      <span className="text-white opacity-70">Loading...</span>
    </>
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // input && callOpenaiAPI();
    scrollToBottom();
  }, [messages]);

  return (
    <div className="App">
      <header className="flex justify-between px-6 py-4">
        <div>
          <img src={Logo} alt="logo" />
        </div>
        <div className="flex py-2">
          <img className="w-3" src={CommentInfo} alt="CommentInfo" />
          <h6 className="text-sm font-medium md:text-sm mx-1 md:font-semibold">
            How it works?
          </h6>
        </div>
      </header>
      <div className="vertical-line"></div>
      <div className="body m-7  md:mt-8 md:ml-40 md:pr-56">
        <h1 className="font-bold text-2xl ">Welcome to your Grimoire,</h1>
        <h6>Embark on an adventure of your choice...</h6>
      </div>

      <div className="relative w-80 left-10 md:w-4/5 pb-[100px] md:ml-40 my-5 md:min-h-[cal(100vh_-_150px)] md:pb-[170px]">
        {messages.map((messages, i) => (
          <div
            ref={messagesEndRef}
            key={i}
            className={`   relative p-3 md:max-w-2xl rounded-lg  md:w-3/5 md:right-10 overflow-y-auto whitespace-normal text-black my-2 mb-4 ${
              messages.role !== "assistant"
                ? "bg-gray-300 md:ml-auto md:mr-16"
                : "bg-purple-200 "
            }`}
            dangerouslySetInnerHTML={{ __html: messages.content || "" }}
          >
            {/* {messages.content} */}
          </div>
        ))}
        {isThinking && (
          <div className="flex items-center justify-center w-28 px-3 py-1 text-xs font-medium leading-none text-center animate-bounce ">
            loading...
          </div>
        )}
      </div>

      <div className="fixed w-80 left-10 bottom-0 md:w-4/5 md:left-32 md:right-52 md:p-8 md:pt-2 bg-white">
        <textarea
          placeholder="E.g “a haunted mansion”, “a spaceship bound for a new galaxy”,“a medieval kingdom” "
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full flex-grow  p-0.5  border border-purple-700 md:p-2 rounded-lg"
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.shiftKey === false) {
              e.preventDefault();
              input && onSubmitAction();
            }
          }}
        ></textarea>
        <button
          onClick={onSubmitAction}
          className="bg-purple-700 text-white w-full mb-2 p-2 mt-2 rounded-lg hover:bg-purple-900 md:2xl "
        >
          Send
        </button>
      </div>
      {!messages.length && (
        <div
          className="absolute top-[200px]
          md:transform-translate-x-1/2 md:pl-6 md:pr-6 md:left-32"
        >
          <p className="mr-4 font-medium ml-7 md:pt-2 md:ml-2 md:pr-96">
            Please provide me with a theme or setting for your interactive
            fiction story. For instance, it could be something like "a haunted
            mansion," "a spaceship bound for a new galaxy," "a medieval
            kingdom," or any other setting you prefer. Once I have the theme,
            I'll begin crafting the narrative and offer you choices to guide the
            story.
          </p>

          <p className="font-semibold flex justify-end mr-10 pb-2 pt-8 md:mr-44">
            Choose your theme or setting
          </p>

          <div className="options flex justify-end mx-8 p-0 md:flex md:justify-end md:mr-[170px] md:ml-[423px] ">
            <button
              className="options-btn hover:bg-purple-600 p-0 md:m-1 md:p-1.5 rounded-lg "
              onClick={() => selectOption(" A meadow outside the White House")}
            >
              A meadow outside the White House
            </button>
            <button
              className="options-btn hover:bg-purple-600 m-1 p-1.5 rounded-lg"
              onClick={() => selectOption("A medieval Kingdom")}
            >
              A medieval Kingdom
            </button>
            <button
              className="options-btn m-1 hover:bg-purple-600 p-1.5 rounded-lg"
              onClick={() => selectOption(" A haunted mansion")}
            >
              A haunted mansion
            </button>
            <button
              className="options-btn hover:bg-purple-600 m-1 p-1.5 rounded-lg"
              onClick={() => selectOption(" Ancient Egypt")}
            >
              Ancient Egypt
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
