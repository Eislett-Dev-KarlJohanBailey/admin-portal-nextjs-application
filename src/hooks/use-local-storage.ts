
import { useState } from "react"
import { isValidJSON } from "../services/utils"


const useLocalStorage = (key: string, initialValue: string | undefined) => {
  const [state, setState] = useState(() => {
    // Initialize the state
    if (typeof window === 'undefined')
      return undefined
    
    try {
      const value = localStorage.getItem(key)
      // Check if the local storage already has any values,
      // otherwise initialize it with the passed initialValue
      return value ?
        (isValidJSON(value) ? JSON.parse(value) : value)
        : initialValue
    }
    catch (error) {
      // Logger.error(`Failed to get "${key}" to Local storage: ` , error)
      console.log(`Failed to get "${key}" to Local storage: ` , error)
    }
  })

  const setValue = (value: string | undefined) => {
    try {
      if (typeof window === 'undefined')
        return 

      // If the passed value is a callback function,
      //  then call it with the existing state.
      if (!value)
        localStorage.removeItem(key)
      else {
        const valueToStore = typeof value == 'object' ? JSON.stringify(value) : value
        localStorage.setItem(key, valueToStore)
      }
      setState(value)
    } catch (error) {
      // Logger.error(`Failed to add "${key}" to Local storage: ` , error)
      console.log(`Failed to add "${key}" to Local storage: ` , error)
    }
  }

  return [state, setValue]
}

export default useLocalStorage