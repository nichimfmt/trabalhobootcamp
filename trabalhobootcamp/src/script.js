import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://lezbbxhrcqmhtowspbvh.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_WnsF2jiU4MgViMOERWEakw_mTCQdE5y";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let pokemonsSalvosCache = [];

async function buscarDados(termo) {
    const area = document.getElementById("resultado");
    if (!area) return;
    area.innerHTML = "Carregando...";
    try {
        const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${termo}`);
        if (!resposta.ok) throw new Error("Não encontrado");
        const dados = await resposta.json();
        
        area.innerHTML = `
            <h2>${dados.name.toUpperCase()}</h2>
            <img src="${dados.sprites.front_default}" alt="${dados.name}">
            <p>Altura: ${dados.height} | Peso: ${dados.weight}</p>
            <button id="botao-salvar">Salvar nos Favoritos</button>
        `;

        const btnSalvar = document.getElementById("botao-salvar");
        if (btnSalvar) {
            btnSalvar.onclick = () => {
                salvarFavorito(dados.name);
            };
        }
    } catch (erro) {
        area.innerHTML = "<p>Ops! Nada encontrado. Tente outro termo.</p>";
    }
}

async function salvarFavorito(nome) {
    // Verifica se já existe na lista atual
    const jaExiste = pokemonsSalvosCache.some(item => item.nome_pokemon.toLowerCase() === nome.toLowerCase());
    
    if (jaExiste) {
        alert("Este Pokémon já está nos favoritos!");
        return;
    }

    const { error } = await supabase
        .from("favoritos")
        .insert({ nome_pokemon: nome });
    
    if (error) {
        console.error("Erro ao salvar:", error);
    } else {
        listarFavoritos();
    }
}

async function listarFavoritos() {
    const { data, error } = await supabase
        .from("favoritos")
        .select("*")
        .order("id", { ascending: true });

    if (!error) {
        pokemonsSalvosCache = data || [];
        renderizarLista(pokemonsSalvosCache);
    } else {
        console.error("Erro ao carregar favoritos:", error);
    }
}

window.removerFavorito = async function(id) {
    const { error } = await supabase
        .from("favoritos")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Erro ao remover favorito:", error);
    } else {
        listarFavoritos();
    }
};

function renderizarLista(lista) {
    const listaHtml = document.getElementById("lista-favoritos");
    if (!listaHtml) return;

    listaHtml.innerHTML = "";

    if (!lista || lista.length === 0) {
        listaHtml.innerHTML = "<li>Nenhum favorito salvo.</li>";
        return;
    }

    lista.forEach(item => {
        const li = document.createElement("li");
        li.style.margin = "8px 0";
        li.innerHTML = `
            <span>${item.nome_pokemon || "Pokémon"}</span>
            <button onclick="window.removerFavorito(${item.id})" style="margin-left: 10px; color: red; cursor: pointer;">Excluir</button>
        `;
        listaHtml.appendChild(li);
    });
}

window.onload = () => {
    const btnBuscar = document.getElementById("btn-buscar");
    const campoBusca = document.getElementById("input-busca");

    if (btnBuscar && campoBusca) {
        btnBuscar.onclick = () => {
            const termo = campoBusca.value.toLowerCase().trim();
            if (termo) buscarDados(termo);
        };
    }

    listarFavoritos();
};