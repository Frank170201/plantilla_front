const staticVar = () => {
    const headers = [
        { align: "center", title: "Nombre", key: "nombre", sortable: true },
        { align: "center", title: "Descripcion", key: "descripcion", sortable: true },
        { align: "center", title: "Acciones", key: "acciones", sortable: false },
    ];

    return { headers };
}

export default staticVar;