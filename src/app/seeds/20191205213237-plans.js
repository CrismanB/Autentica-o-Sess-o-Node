"use strict";

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert(
            "plans",
            [
                {
                    title: "start",
                    duration: 1,
                    price: 129,
                    created_at: new Date(),
                    updated_at: new Date()
                },
                {
                    title: "gold",
                    duration: 3,
                    price: 109,
                    created_at: new Date(),
                    updated_at: new Date()
                },
                {
                    title: "Diamond",
                    duration: 6,
                    price: 89,
                    created_at: new Date(),
                    updated_at: new Date()
                }
            ],
            {}
        );
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete("plans", null, {});
    }
};
