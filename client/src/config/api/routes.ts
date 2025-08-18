export const API_URL = import.meta.env.VITE_API_URL;

export const ApiRoutes = {
    auth: {
        login: "/users/auth/login",
        register: "/users/auth/register",
    },
    users: {
        prefix: "/users",
        me: "/users/me",
    },
    credentials: {
        prefix: "/credentials",
        user: "/credentials/user",
        update: (uuid: string) => `/credentials/${uuid}`,
        delete: (uuid: string) => `/credentials/${uuid}`,
    },
    account: {
        income: "/account/income",
        trades: "/account/trades",
        status: "/account/status",
        income_chart: "/account/income/chart",
    },
    bot: {
        prefix: "/bots",
        get: "/bots",
        start: "/bots/start",
        stop: "/bots/stop",
        start_all: "/bots/start-all",
        stop_all: "/bots/stop-all",
        bot_subscription: (uuid: string) => `/bots/${uuid}/user/subscription`
    },
    bot_subscription: {
        prefix: "/bot/subscriptions",
        start_all: "/bot/subscriptions/start-all",
        stop_all: "/bot/subscriptions/stop-all",
    },
}