const staticVar = () => {
    const headers = [
        { align: "center", title: "Icono", key: "icono", sortable: true },
        { align: "center", title: "Nombre", key: "nombre", sortable: true },
        { align: "center", title: "Acciones", key: "acciones", sortable: false },
    ];

    const iconsUsed = [
        { icon: "mdi-water", titulo: "Agua" },
        { icon: "mdi-flash", titulo: "Luz" },
        { icon: "mdi-delete-circle-outline", titulo: "Basurero" },
        { icon: "mdi-wifi", titulo: "Internet" },
        { icon: "mdi-cable-data", titulo: "Cable" },
    ];

    return { headers, iconsUsed };
}

export default staticVar;