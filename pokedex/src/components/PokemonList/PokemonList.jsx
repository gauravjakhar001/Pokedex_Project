import { useEffect, useState } from "react";
import axios from 'axios';
import './PokemonList.css';
import Pokemon from "../Pokemon/Pokemon";


function PokemonList(){

    const [PokemonList ,setPokemonList] = useState([]);
    const [isLoading ,setIsLoading] = useState(true);

    const POKEDEX_URL= 'https://pokeapi.co/api/v2/pokemon?offset=20&limit=20';

    async function downloadPokemon (){
        const response =  await axios.get(POKEDEX_URL);  // This downloades the list of the 20 pokemons 

        const pokemonResults = response.data.results; // We get the array of the pokemons from the result

        console.log(response.data);

        // Iterating over the array of pokemons ,and using their url, to create an array of promises
        // that will download those 20 pokemons 

        const pokemonResultPromise =  pokemonResults.map((pokemon) => axios.get(pokemon.url));

        //Passing that promise array to axios.all

        const pokemonData = await axios.all(pokemonResultPromise);// Array of 20 pokemons detailed data 
        console.log(pokemonData);

        // now iterate on the data of each pokemon, and extract id,name , image, types 
        const pokeListResult =pokemonData.map((pokeData) =>{
            const pokemon  = pokeData.data;

            return { 
                    id : pokemon.id,
                    name : pokemon.name  ,
                    image : (pokemon .sprites.other)? pokemon.sprites.other.dream_world.front_default: pokemon.sprites.front_shiny,
                    types: pokemon.types
                }

        });
        console.log(pokeListResult);
        setPokemonList(pokeListResult);
        setIsLoading(false);
    }

    useEffect(()=> {
       downloadPokemon();
       
    },[]);


    return (
    <div className="pokemon-list-wrapper"> 
         <div>Pokemon List  </div>
         {(isLoading) ?'Loading....':
            PokemonList.map((p)=> <Pokemon  name={p.name} image = {p.image} key ={p.id}/>)
        }

    </div>
    )
}

export default PokemonList;