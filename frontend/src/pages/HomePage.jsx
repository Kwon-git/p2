import React from 'react'
import Home from './Home'
import HomeStudent from './HomeStudent'
const HomePage = () => {
    const role = localStorage.getItem('role')
    return (
        <div>
            {role == 'lecturer' ? (
                <Home />
            ) : (
                <HomeStudent />
            )}
        </div>
    )
}

export default HomePage