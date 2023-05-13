import { useEffect, useState } from "react"

export default function useMenu(ref, mode) {
    const [position, setPosition] = useState([])
    const [openMenu, setOpenMenu] = useState(false)

    const handleOpenMenu = (event) => {
        event.preventDefault()
        if (ref?.current?.contains(event.target) && mode === 'inner') {
            const { clientX, clientY } = event
            setPosition([clientX, clientY])
            setOpenMenu(true)
        }

        if (!ref?.current?.contains(event.target) && mode === 'outer') {
            const { clientX, clientY } = event
            setPosition([clientX, clientY])
            setOpenMenu(true)
        }
    }

    const handleCloseMenu = () => {
        setOpenMenu(false)
    }

    useEffect(() => {
        document.body.addEventListener('click', handleCloseMenu)
        return () => {
            document.body.removeEventListener('click', handleCloseMenu)
        }
    }, [])

    return {
        position,
        openMenu,
        handleOpenMenu
    }
}