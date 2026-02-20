import React from 'react'
import { SavedPropertiesProvider } from '../context/SavedPropertiesContext'


const SavedProvider = ({children}) => {
  return (
    <SavedPropertiesProvider>
        {children}
    </SavedPropertiesProvider>
  )
}

export default SavedProvider
