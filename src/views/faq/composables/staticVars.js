const staticVar = () => {
    const headers = [
        { align: "center", title: "Pregunta", key: "pregunta", sortable: false },
        // { align: "center", title: "Respuesta", key: "respuesta", sortable: false },
        { align: "center", title: "Activo", key: "activo", sortable: false },
        { align: "center", title: "Acciones", key: "acciones", sortable: false },
    ];

    return { headers };
}

export default staticVar;