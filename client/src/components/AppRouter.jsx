import React, { useContext } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { publicRoutes, privateRoutes } from '../router'
import { useSelector } from 'react-redux';

const AppRouter = () => {
    const isAuth = useSelector(state => state.user.isAuth)

    return (
        <Routes>
            {isAuth
                ?
                <>
                    {privateRoutes.map(route =>
                        <Route
                            path={route.path}
                            element={route.element}
                            key={route.path}
                        />
                    )}
                    <Route
                        path="*"
                        element={<Navigate to="/" replace />}
                    />
                </>
                :
                <>
                    {publicRoutes.map(route =>
                        <Route
                            path={route.path}
                            element={route.element}
                            key={route.path}
                        />
                    )}
                    <Route
                        path="*"
                        element={<Navigate to="/login" replace />}
                    />
                </>
            }

        </Routes>
    )
}

export default AppRouter