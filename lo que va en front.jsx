import React, { useState } from 'react';
import axios from 'axios';

function App() {
    const [error, setError] = useState(null);
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const [to, setTo] = useState('');
    const [subject, setSubject] = useState('');
    const [text, setText] = useState('');
    const [html, setHtml] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!to || !subject || !text || !html) {
            setError('All fields are required');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await axios.post('http://localhost:3001/api/mail', { to, subject, text, html });
            setSent(true);
        } catch (error) {
            setError(error.response ? error.response.data : 'Something went wrong');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    placeholder="To"
                    disabled={loading}
                />
                <input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Subject"
                    disabled={loading}
                />
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Text"
                    disabled={loading}
                />
                <input
                    value={html}
                    onChange={(e) => setHtml(e.target.value)}
                    placeholder="Html code"
                    disabled={loading}
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Sending...' : 'Submit'}
                </button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {sent && <p>Email Sent!</p>}
        </div>
    );
}

export default App;
