export const API_URL = import.meta.env.VITE_API_URL;

export const ApiRoutes = {
    users: {
        prefix: "/users",
        me: "/users/me",
    },
    account: {
        income: "/binance/account/income",
        trades: "/binance/account/trades",
        status: "/binance/account/status",
        income_chart: "/binance/account/income/chart",
    },
    bot: {
        prefix: "/binance/bot",
        start: "/binance/bot/start",
        stop: "/binance/bot/stop",
    },
}