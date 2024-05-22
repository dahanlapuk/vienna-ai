import { useState, useEffect, useRef } from 'react';
import { requestToGroqAI } from './utils/groq';
import './App.css';
import { Light as SyntaxHighlight } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [data, setData] = useState("");
  const [apiResponse, setApiResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [index, setIndex] = useState(0); 
  const [isLocked, setIsLocked] = useState(false);
  const textAreaRef = useRef(null);

  useEffect(() => {
    if (displayText === "" && apiResponse && isTyping) { 
      setIndex(0); 
    }
  }, [apiResponse, displayText, isTyping]);

  useEffect(() => {
    if (isTyping && index < apiResponse.length) {
      const timer = setTimeout(() => {
        setDisplayText((prev) => prev + apiResponse.charAt(index));
        setIndex((prev) => prev + 1);
      }, 10);
      return () => clearTimeout(timer);
    } else if (index >= apiResponse.length) {
      setIsTyping(false);
    }
  }, [index, isTyping, apiResponse]);

  const stopTyping = () => {
    setIsTyping(false);
    setDisplayText(apiResponse); 
  };

  const handleButtonClick = () => {
    if (isTyping) {
      stopTyping();
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    console.log(`${new Date().toISOString()} - Submitting and locking the textarea`);
    setLoading(true);
    setIsTyping(false);
    setIsLocked(true);

    await new Promise(resolve => setTimeout(resolve, 20)); 

    const ai = await requestToGroqAI(document.getElementById('content').value);
    console.log(`${new Date().toISOString()} - Received AI response`);
    setApiResponse(ai);
    setLoading(false);
    setIsTyping(true);
    console.log(`${new Date().toISOString()} - Textarea should be locked now`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); 
      handleSubmit(); 
    }
  };

  const handleChange = (e) => {
    if (!isLocked) {
      setData(e.target.value);
    } else {
      alert('Text area terkunci.');
    }
  };

  const handleClickTextArea = () => {
    console.log(`${new Date().toISOString()} - Textarea clicked, isLocked:`, isLocked);
    if (isLocked) {
      toast.error('Area teks terkunci, Refresh halaman untuk bisa memberikan perintah. Vienna AI masih dalam tahap pengembangan, harap maklum ya..:)', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.log(`${new Date().toISOString()} - User clicked on locked textarea.`);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(displayText).then(() => {
      alert('Teks berhasil disalin!');
    }, (err) => {
      alert('Gagal menyalin teks, silakan coba lagi.');
      console.error('Error copying text: ', err);
    });
  };

  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <div className="flex flex-col min-h-screen m-0 p-0">
      <ToastContainer />
      <main className='flex flex-col flex-1 justify-center items-center max-w-xl w-full mx-auto'>
        <h1 className='text-4xl text-gray-400 cursor-pointer' onClick={refreshPage}>Vienna AI</h1>
        <form className='flex flex-col gap-4 py-4 w-full'>
          <textarea
            className={`py-2 px-6 text-md rounded-md w-full h-32 resize-none ${isLocked ? 'disabled-textarea' : ''}`}
            placeholder='Tanyakan disini..'
            id='content'
            value={data}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onClick={handleClickTextArea}
            readOnly={isLocked}
            ref={textAreaRef}
          />
          <button
            onClick={handleButtonClick}
            className='bg-sky-900 py-2 px-4 font-bold text-gray-200 rounded-md hover:text-red-500'
            type='button'
            disabled={loading}
            onMouseOver={e => isTyping ? e.currentTarget.textContent = "Hentikan penulisan.." : null}
            onMouseOut={e => e.currentTarget.textContent = loading ? "Sedang berpikir..." : isTyping ? "Hentikan penulisan.." : "Kirim"}
          >
            {loading ? "Sedang berpikir..." : isTyping ? "Hentikan penulisan.." : "Kirim"}
          </button>
          <div className="text-right text-xs text-gray-500 italic">
            Shift+Enter untuk baris baru
          </div>
        </form>
        <div className='max-w-xl w-full mx-auto typewriter'> 
          {displayText ? (
            <>
              <SyntaxHighlight language='swift' style={darcula} wrapLongLines={true}>
                {displayText}
              </SyntaxHighlight>
              <button
                onClick={copyToClipboard}
                className='mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
              >
                Salin Teks
              </button>
            </>
          ) : null}
        </div>
      </main>
      <footer className="w-full bg-gray-800 text-white p-4">
        <div className="flex flex-col items-start justify-between w-full px-10">
          <p>Kritik dan Saran, Hubungi :</p>
          <p>Email: <a href="mailto:itbamuhammad.dev@gmail.com" target='_blank' className="text-sky-500 hover:text-sky-300">itbamuhammad.dev@gmail.com</a></p>
          <p>Instagram: <a href="https://instagram.com/itbamuhammad_" target='_blank' className="text-sky-500 hover:text-sky-300">@itbamuhammad_</a></p>
        <div className="flex flex-col items-end text-sky-200">
          <p>versi 1.0a</p>
        </div>
          <p className="text-sm mt-4 self-center">© 2024 Itba Muhammad Kamil</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
