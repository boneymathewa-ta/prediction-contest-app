import { useParams } from "react-router-dom";
import contestServices from "./services/contestservices";
import { useEffect } from "react";

const ContestDetails = () => {
    const { id } = useParams<{ id: string }>();
    useEffect(() => {
        contestServices.getContestDetails(id!).then(details => {
            console.log("Contest details:", details);
        }).catch(error => {
            console.error("Error fetching contest details:", error);
        });
    }, [id]);
    return (<div>
        <h1>Contest Details for ID: {id}</h1>

    </div>)
}

export default ContestDetails;