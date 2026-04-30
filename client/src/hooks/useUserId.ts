// Create a state variable called userId with useState — start it as an empty string ""
// Use useEffect with an empty array [] — this means "run this code once when the component first loads"
// Inside that useEffect:

import { useState } from "react";


// Check localStorage: localStorage.getItem('userId')
// If it returns something → save that value into your userId state
// If it returns null → generate a new random ID, save it to localStorage with localStorage.setItem, then put it in state too
// Return userId at the end of the hook



const useUserId = () => {
    const [userId] = useState(() => {
        const existing = localStorage.getItem('userId')
        if (existing) return existing
        const newId = Math.random().toString(36).slice(2, 9)
        localStorage.setItem('userId', newId)
        return newId
    })

    return userId
}

export default useUserId