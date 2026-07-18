export type Sombra = {
    id: number;
    nombre: string;
    puntos: number;
    image: any; // puedes usar ImageSourcePropType si quieres más estricto
};

export const sombras: Sombra[] = [
    { id: 1, nombre: "Sombra pequeña", puntos: 5, image: require("../assets/sombras/Pixie.png") },
    { id: 2, nombre: "Sombra mediana", puntos: 10, image: require("../assets/sombras/Cu_Chulainn.png") },
    { id: 3, nombre: "Sombra grande", puntos: 20, image: require("../assets/sombras/Sandman.png") },
];
