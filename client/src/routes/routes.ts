export const Routes = {
    auth: {
        sign_in: "/auth/sign-in",
        sign_up: "/auth/sign-up",
        credentials: "/auth/credentials",
        confirmation: "/auth/confirmation",
    },
    dashboard: {
        root: "/dashboard",
    },
    bots: {
        root: "/dashboard/bots",
        bot: (id: string) => `/dashboard/bots/${id}`,
    },
};