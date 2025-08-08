export const auroraStyle = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

@keyframes moveGradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}
body {
    background: linear-gradient(-45deg, #0b021a, #2c0b4d, #1a0a3a, #000000);
    background-size: 400% 400%;
    animation: moveGradient 15s ease infinite;
    font-family: 'Inter', sans-serif;
}
`;

export const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
};

export const formBoxStyle = {
    width: '100%',
    maxWidth: '420px',
    padding: '40px',
    background: "rgba(25, 25, 25, 0.45)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "20px",
    boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
    color: "#ffffff",
};

export const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    marginBottom: "16px",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    background: "rgba(0, 0, 0, 0.2)",
    color: '#fff',
    borderRadius: "8px",
    fontSize: "1rem",
    outline: 'none',
    boxSizing: 'border-box'
};

export const buttonStyle = {
    width: "100%",
    padding: "12px",
    background: "linear-gradient(to right, #8e2de2, #4a00e0)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "1rem",
    transition: "opacity 0.2s ease",
};

export const linkStyle = {
    color: '#c792ea', 
    textDecoration: 'none'
};