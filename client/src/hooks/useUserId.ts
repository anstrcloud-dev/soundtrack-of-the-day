import { useState } from 'react'


// Check localStorage: localStorage.getItem('userId')
// If it returns something → save that value into your userId state
// If it returns null → generate a new random ID, save it to localStorage with localStorage.setItem, then put it in state too
// Return userId at the end of the hook



const useUserId = () => {
    const [userId] = useState(() => {
        const existing = localStorage.getItem('userId')
        if (existing) return existing
        const newId = Math.random().toString(36).slice(2, 9) //clean unique 7-character ID code
        localStorage.setItem('userId', newId)
        return newId
    })

    return userId
}

export default useUserId