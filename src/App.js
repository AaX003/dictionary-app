import axios from 'axios';
import { useState } from 'react';

import "./App.css";

// SVGS
import { IoIosSearch, IoMdClose  } from "react-icons/io";


function Dictionary() {

  const [word, setWord] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [err, setErr] = useState("");


    const HandleClear = () => {
      setWord("");
      setErr("");
      setResult(null);
      setIsLoading(false);
    }

    const HandleSearch = (event) => {
      if (event.key === "Enter") {
        const guard = word.trim().toLowerCase();

        if (!guard) return;
        setIsLoading(true);

        axios
        .get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`) 
        .then((response) => {
          const res = response.data;
          const data = {
            a: res?.[0]?.phonetics?.[0]?.audio || [],
            w: res?.[0]?.word,
            pos: res?.[0]?.meanings?.[0]?.partOfSpeech || [],
            t: res?.[0]?.phonetics?.[0]?.text,
            d: res?.[0]?.meanings[0]?.definitions[0]?.definition, 
            ex: res?.[0]?.meanings[0]?.definitions[0]?.example || [],
            syn: res?.[0]?.meanings[0]?.definitions?.[0]?.synonyms || []
          };
          setResult(data);
          setErr("");
        })
        .catch((e) => {
          setErr(e?.response?.status === 404 ? "No word found" : "Fetch failed");
        })
        .finally(() => setIsLoading(false));
      }
    }

  return (
      <div className="container">
        <header>
          <h2 className="title">English Dictionary</h2>
        </header>
      <section className="input-container">
        
        <span className="search-svg"><IoIosSearch /></span>
        <input
          type="text"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          onKeyDown={HandleSearch}
          placeholder="Type a word for definition"
        />
        <button className="clear-svg" onClick={HandleClear} style={{ opacity: !word ? "0" : ""}}><IoMdClose /></button>
      </section>

      {word.length === 0 && (
        <section className="empty-msg-container">
          <small className="empty-msg">Type in a word for definition, synonyms, examples, etc.</small>
        </section>
      )}
      
      {!err && (
        <section className="word-display-container" style={{ background: !result ? "none" : "white", boxShadow: !result ? "none" : "0px 4px 10px #00000039"}}>
          {isLoading && !result && <small className="loading-msg">{ `Searching for the word ${word}` }...</small>}

          {result?.a  && <audio controls src={result.a}></audio>}

          {result?.w && <h4 className="word">{result.w}</h4>}

          {result?.pos && <small className="partOfSpeech"><em>{result.pos.length ? result.pos : "No part of speech available" }</em></small>}
          
          {result?.t && <small className="text">{result.t}</small>}

          <hr style={{ borderLeft: !result ? "none" : "1px solid #7b7b7b27", width: !result ? "0%" : "100%"}}></hr>

          {result?.d && <small className="definition"><strong>Definition:</strong> {result.d}</small>} <br />

          {result?.ex && <small className="example"><strong>Example:</strong> {result.ex.length ? result.ex : "No examples available" }</small>} <br />

          {result?.syn && <small className="synonym"><strong>Synonyms:</strong> {result.syn.length ? result.syn.join(", ") : "No synonyms available" }</small>}
        </section>
      )}
      
      {err && (
        <section className="err-display-container">
          <small className="err-msg">{err}</small>
        </section>
      )}
  
    </div>
  );
}

export default Dictionary;
