import React, { useState, useEffect } from 'react';
import './style.css'; // Import CSS styles

function Dictionary() {
    // State variables
    const [language, setLanguage] = useState('en');
    const [word, setWord] = useState('');
    const [results, setResults] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Function to handle the API call and state updates
    const handleSearch = async () => {
        const termToSearch = word.trim() || 'work'; // Mặc định tìm "work" nếu input trống
        console.log('Bắt đầu tìm kiếm cho:', termToSearch, 'Ngôn ngữ:', language); // DEBUG

        setIsLoading(true);
        setError(null);
        setResults(null);

        // --- QUAN TRỌNG: Kiểm tra URL API ---
        // Nếu React app và backend khác port, bạn có thể cần URL đầy đủ
        // const apiUrl = `http://localhost:3000/api/dictionary/${language}/${encodeURIComponent(termToSearch)}`;
        // Hoặc nếu đã cấu hình proxy trong React (ví dụ: vite.config.js hoặc package.json):
        const apiUrl = `/api/dictionary/${language}/${encodeURIComponent(termToSearch)}`;
        console.log('API URL:', apiUrl); // DEBUG

        try {
            const response = await fetch(apiUrl);
            console.log('API Response Status:', response.status); // DEBUG

            if (!response.ok) {
                let errorMsg = `Lỗi ${response.status}`;
                try {
                    const errorData = await response.json();
                    console.log('API Error Data:', errorData); // DEBUG
                    errorMsg = errorData.error || `Không thể tìm thấy từ "${termToSearch}" hoặc có lỗi server`;
                } catch (parseError) {
                    console.error('Không thể parse lỗi JSON từ API:', parseError); // DEBUG
                }
                throw new Error(errorMsg);
            }

            const data = await response.json();
            console.log('API Data Received:', data); // DEBUG
            setResults(data); // Cập nhật state với dữ liệu nhận được

        } catch (err) {
            console.error("Fetch error:", err); // DEBUG
            setError(err.message || 'Đã xảy ra lỗi khi tìm kiếm. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
            console.log('Kết thúc quá trình tìm kiếm.'); // DEBUG
        }
    };

    // Handle Enter key press
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    // --- JSX Structure ---
    return (
        <div className="p-5 text-center bg-purple-100 min-h-screen">
            <h1 className="text-3xl font-bold mt-5">Cambridge Dictionary</h1>

            <div className="pick mt-8 flex mx-auto items-center justify-center mb-5">
                <select
                    name="lang"
                    className="bg-purple-300 rounded-lg px-3 py-1 mx-2 text-lg"
                    title="language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    disabled={isLoading}
                >
                    <option value="en">en</option>
                    <option value="uk">uk</option>
                    <option value="en-tw">en-tw</option>
                    <option value="en-cn">en-cn</option>
                </select>

                <input
                    className="bg-purple-300 rounded-lg px-3 py-1 !text-black placeholder:text-black mx-2 text-lg"
                    type="text"
                    name="word"
                    title="word"
                    placeholder="enter the word"
                    value={word}
                    onChange={(e) => setWord(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                />
            </div>

            <button
                onClick={handleSearch}
                className="px-10 font-bold text-xl py-2 hover:drop-shadow-xl transition-[0.2s] rounded-lg bg-purple-400 drop-shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                type="button"
                disabled={isLoading}
            >
                {isLoading ? 'Searching...' : 'GO'}
            </button>

            {/* Results Area */}
            <div id="results" className="mt-8 text-left max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
                {isLoading && <p>Đang tìm kiếm...</p>}
                {error && <p style={{ color: 'red' }}>Lỗi: {error}</p>}
                {/* Chỉ render RenderResults khi có kết quả, không loading và không có lỗi */}
                {results && !isLoading && !error && (
                    <RenderResults data={results} />
                )}
                {!isLoading && !error && !results && (
                    <p>Nhập từ và nhấn GO để tìm kiếm (mặc định là "work" nếu để trống).</p>
                )}
            </div>
        </div>
    );
}

// --- Helper Component to Render Results ---
function RenderResults({ data }) {
    console.log('Rendering results with data:', data); // DEBUG

    // Kiểm tra kỹ hơn xem có dữ liệu hợp lệ không
    if (!data || typeof data !== 'object' || !data.word) {
         // Nếu API trả về lỗi nhưng không bị bắt ở catch (ví dụ trả về { error: '...' } với status 200)
         if (data && data.error) {
             return <p style={{ color: 'orange' }}>Thông báo từ API: {data.error}</p>;
         }
        return <p>Không có dữ liệu hợp lệ để hiển thị.</p>;
    }

    const isValidAudioUrl = (url) => url && typeof url === 'string' && url !== 'https://dictionary.cambridge.orgundefined' && !url.endsWith('undefined');

    return (
        <div className="dictionary-entry">
            {/* 1. Word */}
            <h1 className="word">{data.word}</h1>

            {/* 2. POS Main */}
            {/* Đảm bảo data.pos là một mảng */}
            {Array.isArray(data.pos) && data.pos.length > 0 && (
                <div className="pos-main">
                    <span className="label">Loại từ: </span>
                    <span className="value">{data.pos.join(', ')}</span>
                </div>
            )}

            {/* 3. Pronunciation */}
            {Array.isArray(data.pronunciation) && data.pronunciation.length > 0 && (
                <section className="pronunciation-section">
                    <h2>Phát âm</h2>
                    <ul>
                        {data.pronunciation.map((p, index) => (
                            <li key={`pron-${index}-${p.lang}-${p.pos || 'no-pos'}`}>
                                {p.lang && <span className="lang">[{p.lang}]</span>}
                                {p.pron && <span className="pron">{p.pron}</span>}
                                {isValidAudioUrl(p.url) && (
                                    <audio controls src={p.url} style={{ height: '30px', verticalAlign: 'middle', marginLeft: '10px' }}>
                                        Trình duyệt không hỗ trợ audio.
                                    </audio>
                                )}
                                {p.pos && <span className="pos-detail">({p.pos})</span>}
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {/* 4. Verbs */}
            {Array.isArray(data.verbs) && data.verbs.length > 0 && (
                <section className="verbs-section">
                    <h2>Các dạng động từ</h2>
                    <ul>
                        {data.verbs.map((v, index) => (
                            <li key={`verb-${v.id !== undefined ? v.id : index}`}>
                                <span className="verb-type">{v.type}:</span>
                                <span className="verb-text">{v.text}</span>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {/* 5. Definitions */}
            {Array.isArray(data.definition) && data.definition.length > 0 && (
                <section className="definitions-section">
                    <h2>Định nghĩa</h2>
                    {data.definition.map((def, index) => (
                        <article key={`def-${index}-${def.pos || 'no-pos'}`} className="definition-item">
                            {def.pos && <span className="pos-detail">{def.pos}</span>}
                            {def.text && <p className="text">{def.text}</p>}
                            {def.translation && <p className="translation"><em>{def.translation}</em></p>}

                            {/* Examples */}
                            {Array.isArray(def.example) && def.example.length > 0 && (
                                <div className="examples">
                                    <h4>Ví dụ:</h4>
                                    <ul>
                                        {def.example.map((ex, exIndex) => (
                                            <li key={`ex-${index}-${ex.id !== undefined ? ex.id : exIndex}`}>
                                                <span className="example-text">{ex.text}</span>
                                                {ex.translation && <span className="example-translation"><em>{ex.translation}</em></span>}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </article>
                    ))}
                </section>
            )}
        </div>
    );
}

export default Dictionary;
