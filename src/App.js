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
    "Create a short fictional story using HTML tag format without the <doctype> and <html> tags. The story should be based on the users input. The story should be structured into chapters. The chapters title should be bolded. It should return the first chapter only first, then when users raises a prompt, it should return the next chapter and so on in that manner.",
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
        max_tokens: 200,
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
    callOpenaiAPI([...messages, PROMPT]);
  };

  const selectOption = (option) => {
    // setInput(option)
    setIsThinking(true);
    setMessages([...messages, { role: "user", content: option }]);
    callOpenaiAPI([...messages, messages]);
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
    input && callOpenaiAPI();
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
          <h6 className="text-sm mx-1 font-semibold">How it works?</h6>
        </div>
      </header>
      <div className="vertical-line"></div>
      <div className="body mt-8 ml-40 pr-56">
        <h1 className="font-bold text-2xl ">Welcome to your Grimoire,</h1>
        <h6>Embark on an adventure of your choice...</h6>
      </div>

      <div className="relative mr-40 ml-44 space mx-auto my-5 min-h-[cal(100vh_-_150px)] pb-[170px]">
        {messages.map((messages, i) => (
          <div
            ref={messagesEndRef}
            key={i}
            className={`  m-3 relative  p-3 max-w-3x rounded-lg  w-3/5 overflow-y-auto whitespace-normal text-black my-2  ${
              messages.role !== "assistant"
                ? "bg-gray-300 "
                : "bg-purple-200 ml-auto"
            }`}
            dangerouslySetInnerHTML={{ __html: messages.content || "" }}
          >
            {/* {messages.content} */}
          </div>
        ))}
        {isThinking && (
          <div className="p-3 max-w-full text-white my-2 ml-auto">
            {preloadSVG}
          </div>
        )}
      </div>

      <div className="fixed bottom-0  p-4 left-32 right-52 md:p-8">
        <textarea
          placeholder="E.g “a haunted mansion”, “a spaceship bound for a new galaxy”,“a medieval kingdom” "
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full border border-purple-700 p-2 rounded-lg"
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.shiftKey === false) {
              e.preventDefault();
              input && onSubmitAction();
            }
          }}
        ></textarea>
        <button
          onClick={onSubmitAction}
          className="bg-purple-700 text-white w-full  p-2 mt-2 rounded-lg hover:bg-purple-900 md:2xl "
        >
          Send
        </button>
      </div>
      {!messages.length && (
        <div
          className="absolute top-[200px]
          transform-translate-x-1/2 pl-6 pr-6 left-32"
        >
          <p className="pt-8 pr-80">
            Please provide me with a theme or setting for your interactive
            fiction story. For instance, it could be something like "a haunted
            mansion," "a spaceship bound for a new galaxy," "a medieval
            kingdom," or any other setting you prefer. Once I have the theme,
            I'll begin crafting the narrative and offer you choices to guide the
            story.
          </p>

          <div className="options ">
            <p className="font-semibold py-4 p-">
              Choose your theme or setting
            </p>
            <button
              className="options-btn "
              onClick={() => selectOption(" A meadow outside the White House")}
            >
              A meadow outside the White House
            </button>
            <button
              className="options-btn"
              onClick={() => selectOption("A medieval Kingdom")}
            >
              A medieval Kingdom
            </button>
            <button
              className="options-btn"
              onClick={() => selectOption(" A haunted mansion")}
            >
              A haunted mansion
            </button>
            <button
              className="options-btn"
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
