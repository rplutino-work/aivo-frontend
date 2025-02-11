import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
    const [userInput, setUserInput] = useState("");
    const [conversation, setConversation] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!userInput.trim()) return;

        setLoading(true);
        try {

            const response = await axios.post("https://aivo-backend-production.up.railway.app/api/analyze", {
                text: userInput,
                conversation, 
            });


            setConversation((prev) => [
                ...prev,
                { role: "user", content: userInput },
                { role: "ai", content: response.data },
            ]);

            setUserInput("");
        } catch (error) {
            console.error("❌ Error en el frontend:", error);
            setConversation((prev) => [
                ...prev,
                { role: "user", content: userInput },
                { role: "ai", content: { error: "No se pudo procesar la solicitud." } },
            ]);
        }
        setLoading(false);
    };

    return (
        <div className="container">
            <h1>📝 Reporte de Incidentes</h1>

            {/* Ventana de chat */}
            <div className="chat-window">
                {conversation.map((entry, index) => (
                    <div key={index} className={`entry ${entry.role}`}>
                        <h3>{entry.role === "user" ? "Tú" : "IA"}</h3>
                        <pre>
                            {typeof entry.content === "string"
                                ? entry.content
                                : JSON.stringify(entry.content, null, 2)}
                        </pre>
                    </div>
                ))}
            </div>

            {/* Área de input */}
            <div className="input-area">
                <textarea
                    placeholder="Describe la situación aquí..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                />
                <button onClick={handleSubmit} disabled={loading}>
                    {loading ? "Procesando..." : "Enviar"}
                </button>
            </div>
        </div>
    );
};

export default App;