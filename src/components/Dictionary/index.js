import './style.css'
function Dictionary() {
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

                    <div className="text-area">
          <textarea
              id="input-text"
              placeholder="What word do you want to understand?"
          ></textarea>

                    </div>
                    <div className="card-bottom">
                        <div>Recent Search</div>
                        <div style={{display: "flex", margin: "10px", alignItems: "n"}}>
                            <label htmlFor="input-language ">history</label>
                            <label htmlFor="input-language">last</label>
                            <label htmlFor="input-language">previous</label>
                        </div>

                        <label htmlFor="search">
                            <span id="upload-title">Search</span>
                            <ion-icon name="cloud-upload-outline">kinh lup</ion-icon>
                            <input type="file" id="upload-document" hidden/>
                        </label>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dictionary