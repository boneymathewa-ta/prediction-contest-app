import { useForm } from "react-hook-form";
import tournamentService from "../services/tournamentservices.js";

const AddTournament = () => {
    type formFields = {
        name: string;
        startDate: string;
        endDate: string;
        sport: string;
        logoUrl: string;
    }
    const { register, handleSubmit } = useForm<formFields>();
    const onSubmit = async (data: formFields) => {
        try {
            const result = await tournamentService.createTournament(data);
            console.log("Tournament created:", result);
        } catch (error) {
            console.error("Error creating tournament:", error);
        }
    };
    return (
        <>
            <form className="tutorial gap-2" onSubmit={handleSubmit(onSubmit)}>
                <input type="text" placeholder="Tournament Name" className="input input-bordered w-full max-w-xs" {...register("name")} />
                <input type="text" placeholder="Start Date" className="input input-bordered w-full max-w-xs" {...register("startDate")} />
                <input type="text" placeholder="End Date" className="input input-bordered w-full max-w-xs" {...register("endDate")} />
                <input type="text" placeholder="Sport" className="input input-bordered w-full max-w-xs" {...register("sport")} />
                <input type="text" placeholder="Logo URL" className="input input-bordered w-full max-w-xs" {...register("logoUrl")} />
                <button type="submit" className="btn btn-primary">Save Tournament</button>
            </form>
            <div></div>
        </>
    );
};

export default AddTournament;