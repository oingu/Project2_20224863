import './style.css'
function Header() {
    return (
        <>
            <header className="header">
                <nav className="nav container">
                    <div className="nav__data">
                        <a href="#" className="nav__logo">
                            <i className="ri-planet-line"></i> WordMate
                        </a>

                        <div className="nav__toggle" id="nav-toggle">
                            <i className="ri-menu-line nav__burger"></i>
                            <i className="ri-close-line nav__close"></i>
                        </div>
                    </div>


                    <div className="nav__menu" id="nav-menu">
                        <ul className="nav__list">
                            <li><a href="#" className="nav__link">Dictionary</a></li>

                            <li><a href="#" className="nav__link">Documents</a></li>


                            <li className="dropdown__item">
                                <div className="nav__link">
                                    FlashCards <i className="ri-arrow-down-s-line dropdown__arrow"></i>
                                </div>

                                <ul className="dropdown__menu" style={{position:"absolute", top: "52px"}}>
                                    <li>
                                        <a href="#" className="dropdown__link">
                                            <i className="ri-pie-chart-line"></i> Overview
                                        </a>
                                    </li>

                                    <li>
                                        <a href="#" className="dropdown__link">
                                            <i className="ri-arrow-up-down-line"></i> Transactions
                                        </a>
                                    </li>



                                </ul>
                            </li>

                            <li className="dropdown__item">
                                <div className="nav__link">
                                    Games <i className="ri-arrow-down-s-line dropdown__arrow"></i>
                                </div>

                                <ul className="dropdown__menu" style={{position:"absolute", top: "52px"}}>
                                    <li>
                                        <a href="#" className="dropdown__link">
                                            <i className="ri-user-line"></i> WordScramble
                                        </a>
                                    </li>

                                    <li>
                                        <a href="#" className="dropdown__link">
                                            <i className="ri-lock-line"></i> Wordle
                                        </a>
                                    </li>


                                </ul>
                            </li>

                            <li><a href="#" className="nav__link">History</a></li>


                            <li className="dropdown__item">
                                <div className="nav__link">
                                    <img style={{border: "solid", borderRadius: "50%", width: "40px", height: "40px"}}
                                         src={require('./logo512.png')}/>
                                </div>

                                <ul className="dropdown__menu" style={{position:"absolute", top: "52px"}}>
                                    <li>
                                        <a href="#" className="dropdown__link">
                                            <i className="ri-user-line"></i> Profiles
                                        </a>
                                    </li>

                                    <li>
                                        <a href="#" className="dropdown__link">
                                            <i className="ri-lock-line"></i> Accounts
                                        </a>
                                    </li>

                                    <li>
                                        <a href="#" className="dropdown__link">
                                            <i className="ri-message-3-line"></i> Achievement
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="dropdown__link">
                                            <i className="ri-message-3-line"></i> Sign out
                                        </a>
                                    </li>
                                </ul>
                            </li>


                        </ul>
                    </div>
                </nav>
            </header>
        </>
    );
}

export default Header;