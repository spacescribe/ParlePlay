import { useNavigate } from "react-router-dom";
import "../styles.css"; // Ensure you have your styles imported

const scenarios = [
    { id: 1, title: "Restaurant", description: "Practise ordering food" },
    { id: 2, title: "Railway station", description: "Practise booking tickets and enquiring about trains" },
    { id: 3, title: "Job interview", description: "Practise common job interview questions" }
];

function Home() {
    const navigate = useNavigate();

    const handlePractiseClick = (scenario) => {
        navigate('/practise', { state: { scenario } });
    };

    return (
        <div className="container">
            <h1>Choose a scenario to practise...</h1>
            <div className="card-container"> {/* Fixed class name */}
                {scenarios.map((scenario) => (
                    <div className="card" key={scenario.id}>  {/* Added return */}
                        <h4>{scenario.title}</h4>
                        <button className="practise-submit" onClick={() => handlePractiseClick(scenario)}>Practise</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;
