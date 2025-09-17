import { useRoutes } from "react-router-dom";
import App from "../App"

const routes = [
    {path: "/list-post", element: <App/>}
]

export default function Router() {
    return useRoutes(routes);
}


