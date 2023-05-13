import Login from "../components/Auth/Login";
import Registration from "../components/Auth/Registration";
import Disk from "../components/Disk/Disk";
import Profile from "../components/Profile";

export const publicRoutes = [
    {path: '/registration', element: <Registration/>},
    {path: '/login', element: <Login/>}, 
]

export const privateRoutes = [
    {path: '/', element: <Disk/>},
    {path: '/profile', element: <Profile/>},
]