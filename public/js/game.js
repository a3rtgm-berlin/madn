const Game = () => {
    return fetchTemplate("game")
        .then((template) => {
            Vue.component("Game", {
                data: () => ({
                    msg: "Du verlyrist"
                }),
                template: template
            });
        })
}