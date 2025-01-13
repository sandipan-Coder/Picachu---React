import { useEffect, useState } from "react";
import "./pokemon.css";
import { PokemonCards } from "./PokemonCards";

export const Pokemon = () =>{

    const [pokemon, setPokemon] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");

    const API = "https://pokeapi.co/api/v2/pokemon?limit=126";

    //! This is one type of API featching function.
    //* const fetchPokemon = () => {
    //*     fetch(API).then((res) => res.json()).then((data) => {
    //*         setApiData(data);
    //*         setLoading(false);
    //*     }).catch((error) => {
    //*                console.log(error); 
    //*                setError(error); 
    //*                setLoading(false);   
    //*     });
    //* };

    const fetchPokemon = async () => {
        try {
            const res = await fetch(API);
            const data = await res.json();

            const detailedpokemonData = data.results.map(async (curPokemon) => {
                const res = await fetch(curPokemon.url);
                const data = await res.json();
                return data;
            });

            const detailedResponses = await Promise.all(detailedpokemonData);
            setPokemon(detailedResponses);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
            setError(error);
        }
    };

    useEffect(() => {
        fetchPokemon();
    }, []);

    //* Search functionality
    
    const searchData = pokemon.filter((curPokemon) => curPokemon.name.toLowerCase().includes(search.toLowerCase()));
    
    //* If data featching take sometime
    if(loading){
        return(
            <div>
                <h1>Loading..........</h1>
            </div>
        );
    };

    //* If anytype of error occours
    if(error){
        return (
            <div>
                <h1>Error: {error.message} </h1>
            </div>
        );
    };

    return (
        <section className="container">
            <header>
                <h1> Your Pokemon Cards </h1>
            </header>
            <div className="pokemon-search">
                <input type="text" placeholder="search pokemon" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>

            <div>
                <ul className="cards">
                    {/* {pokemon.map( (curPokemon) => { */}  
                    {searchData.map( (curPokemon) => {
                        return (
                            <PokemonCards key={curPokemon.id} pokemonData={curPokemon} />
                        );
                    })}
                </ul>
            </div>
        </section>
    );
};