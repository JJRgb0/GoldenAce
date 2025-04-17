const getHomePage = (req, res) => {
    try {
        // Aqui você pode buscar dados do banco ou retornar algo simples
        const data = {
            message: "Bem-vindo à página principal!",
            status: "success"
        };
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Erro ao carregar a página principal" });
    }
};

export default { getHomePage };