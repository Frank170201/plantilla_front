const staticVar = () => {
    const headers = [
        { align: "center", title: "Correo", key: "email", sortable: true },
        { align: "center", title: "Estado", key: "estado", sortable: true },
        { align: "center", title: "Verificado", key: "verified", sortable: true },
        { align: "center", title: "Permiso", key: "permiso", sortable: true },
        { align: "center", title: "Comercio", key: "comercios", sortable: true },
        { align: "center", title: "Acciones", key: "acciones", sortable: false },
    ];

    return { headers };
}

export default staticVar;
