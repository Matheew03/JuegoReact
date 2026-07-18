export type Personaje = {
    id: number;
    nombre: string;
    alias: string;
    habilidad: string;
    image: any;
};

export const personajes: Personaje[] = [
    {
        id: 1,
        nombre: "Ren Amamiya",
        alias: "Joker",
        habilidad: "Doble puntaje al atrapar sombras",
        image: require("../assets/phantom thieves/joker.png"),
    },
    {
        id: 2,
        nombre: "Ryuji Sakamoto",
        alias: "Skull",
        habilidad: "Reduce la velocidad de aparición de sombras",
        image: require("../assets/phantom thieves/Skull.png"),
    },
    {
        id: 3,
        nombre: "Ann Takamaki",
        alias: "Panther",
        habilidad: "Atrapar sombras otorga tiempo extra",
        image: require("../assets/phantom thieves/panther.png"),
    },
    {
        id: 4,
        nombre: "Morgana",
        alias: "Mona",
        habilidad: "Sombras atrapadas dan puntos críticos (chance de +50%)",
        image: require("../assets/phantom thieves/mona.png"),
    },
];
