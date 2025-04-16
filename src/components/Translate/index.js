import React, { useState, useEffect, useRef } from 'react';
import { languages } from './languages'; // Assuming languages.js is in the same directory
import './style.css'; // Import the styles

function Translate() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [inputLanguage, setInputLanguage] = useState('auto');
  const [outputLanguage, setOutputLanguage] = useState('en');
  const inputLanguageRef = useRef(null);
  const outputLanguageRef = useRef(null);

  useEffect(() => {
    populateDropdown(inputLanguageRef.current, languages, setInputLanguage);
    populateDropdown(outputLanguageRef.current, languages, setOutputLanguage);
  }, []);

  useEffect(() => {
    translate();
  }, [inputText, inputLanguage, outputLanguage]);

  function populateDropdown(dropdown, options, setLanguage) {
    if (!dropdown) return;
    const ul = dropdown.querySelector("ul");
    if (!ul) return;
    ul.innerHTML = "";
    options.forEach((option) => {
      const li = document.createElement("li");
      const title = option.name + " (" + option.native + ")";
      li.textContent = title;
      li.dataset.value = option.code;
      li.classList.add("option");
      li.addEventListener("click", () => {
        dropdown.querySelectorAll(".option").forEach((item) => {
          item.classList.remove("active");
        });
        li.classList.add("active");
        const selected = dropdown.querySelector(".selected");
        if (selected) {
          selected.textContent = li.textContent;
          selected.dataset.value = option.code;
        }
        setLanguage(option.code);
        translate();
        dropdown.classList.remove("active");

      });
      ul.appendChild(li);
    });
  }

  function translate() {
    if (!inputText) return;
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${inputLanguage}&tl=${outputLanguage}&dt=t&q=${encodeURI(inputText)}`;

    fetch(url)
      .then((response) => response.json())
      .then((json) => {
        setOutputText(json[0].map((item) => item[0]).join(""));
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function swapLanguages() {
    const tempInputLanguage = inputLanguage;
    const tempOutputLanguage = outputLanguage;
    setInputLanguage(tempOutputLanguage);
    setOutputLanguage(tempInputLanguage);

    const tempInputText = inputText;
    setInputText(outputText);
    setOutputText(tempInputText);
  }

  function handleFileInputChange(event) {
    const file = event.target.files[0];
    if (file && (file.type === "application/pdf" || file.type === "text/plain" || file.type === "application/msword" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setInputText(e.target.result);
      };
      reader.readAsText(file);
    } else {
      alert("Please upload a valid file");
    }
  }

  function handleDownload() {
    if (outputText) {
      const blob = new Blob([outputText], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.download = `translated-to-${outputLanguage}.txt`;
      a.href = url;
      a.click();
    }
  }

  return (
    <div className="container">
      <div className="card input-wrapper">
        <div className="from">
          <span className="heading">From :</span>
          <div className="dropdown-container" id="input-language" ref={inputLanguageRef}>
            <div className="dropdown-toggle">
              <ion-icon name="globe-outline"></ion-icon>
              <span className="selected" data-value="auto">Auto Detect</span>
              <ion-icon name="chevron-down-outline"></ion-icon>
            </div>
            <ul className="dropdown-menu"></ul>
          </div>
        </div>
        <div className="text-area">
          <textarea
            id="input-text"
            cols="30"
            rows="10"
            placeholder="Enter your text here"
            value={inputText}
            onChange={(e) => {
              if (e.target.value.length <= 5000) {
                setInputText(e.target.value);
              }
            }}
          ></textarea>
          <div className="chars"><span id="input-chars">{inputText.length}</span> / 5000</div>
        </div>
        <div className="card-bottom">
          <p>Or choose your document!</p>
          <label htmlFor="upload-document">
            <span id="upload-title">Choose File</span>
            <ion-icon name="cloud-upload-outline"></ion-icon>
            <input type="file" id="upload-document" hidden onChange={handleFileInputChange} />
          </label>
        </div>
      </div>

      <div className="center">
        <div className="swap-position" onClick={swapLanguages}>
          <ion-icon name="swap-horizontal-outline"></ion-icon>
        </div>
      </div>

      <div className="card output-wrapper">
        <div className="to">
          <span className="heading">To :</span>
          <div className="dropdown-container" id="output-language" ref={outputLanguageRef}>
            <div className="dropdown-toggle">
              <ion-icon name="globe-outline"></ion-icon>
              <span className="selected" data-value="en">English</span>
              <ion-icon name="chevron-down-outline"></ion-icon>
            </div>
            <ul className="dropdown-menu"></ul>
          </div>
        </div>
        <textarea
          id="output-text"
          cols="30"
          rows="10"
          placeholder="Translated text will appear here"
          value={outputText}
          disabled
        ></textarea>
        <div className="card-bottom">
          <p>Download as a document!</p>
          <button id="download-btn" onClick={handleDownload}>
            <span>Download</span>
            <ion-icon name="cloud-download-outline"></ion-icon>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Translate;

