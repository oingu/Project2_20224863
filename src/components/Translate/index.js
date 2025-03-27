// import './script.js'
// import './languages.js'
import './style.css'



function Translate() {
    return (
        <>
            <div className="mode">
                <label className="toggle" htmlFor="dark-mode-btn">
                    <div className="toggle-track">
                        <input type="checkbox" className="toggle-checkbox" id="dark-mode-btn"/>
                        <span className="toggle-thumb"></span>
                        <img src="img/sun.png" alt=""/>
                        <img src="img/moon.png" alt=""/>
                    </div>
                </label>
            </div>
            <div className="container">
                <div className="card input-wrapper">
                    <div className="from">
                        <span className="heading">From :</span>
                        <div className="dropdown-container" id="input-language">
                            <div className="dropdown-toggle">
                                <ion-icon name="globe-outline"></ion-icon>
                                <span className="selected" data-value="auto">Auto Detect</span>
                                <ion-icon name="chevron-down-outline"></ion-icon>
                            </div>
                            <ul className="dropdown-menu">
                                <li className="option active">DropDown Menu Item 1</li>
                                <li className="option">DropDown Menu Item 2</li>
                            </ul>
                        </div>
                    </div>
                    <div className="text-area">
          <textarea
              id="input-text"
              cols="30"
              rows="10"
              placeholder="Enter your text here"
          ></textarea>
                        <div className="chars"><span id="input-chars">0</span> / 5000</div>
                    </div>
                    <div className="card-bottom">
                        <p>Or choose your document!</p>
                        <label htmlFor="upload-document">
                            <span id="upload-title">Choose File</span>
                            <ion-icon name="cloud-upload-outline"></ion-icon>
                            <input type="file" id="upload-document" hidden/>
                        </label>
                    </div>
                </div>

                <div className="center">
                    <div className="swap-position">
                        <ion-icon name="swap-horizontal-outline"></ion-icon>
                    </div>
                </div>

                <div className="card output-wrapper">
                    <div className="to">
                        <span className="heading">To :</span>
                        <div className="dropdown-container" id="output-language">
                            <div className="dropdown-toggle">
                                <ion-icon name="globe-outline"></ion-icon>
                                <span className="selected" data-value="en">Englsih</span>
                                <ion-icon name="chevron-down-outline"></ion-icon>
                            </div>
                            <ul className="dropdown-menu">
                                <li className="option active">DropDown Menu Item 1</li>
                                <li className="option">DropDown Menu Item 2</li>
                            </ul>
                        </div>
                    </div>
                    <textarea
                        id="output-text"
                        cols="30"
                        rows="10"
                        placeholder="Translated text will appear here"
                        disabled
                    ></textarea>
                    <div className="card-bottom">
                        <p>Download as a document!</p>
                        <button id="download-btn">
                            <span>Download</span>
                            <ion-icon name="cloud-download-outline"></ion-icon>
                        </button>
                    </div>
                </div>
            </div>
            {<script src="languages.js"></script>}
            {<script src="script.js"></script>}
        </>
    );
}

export default Translate;